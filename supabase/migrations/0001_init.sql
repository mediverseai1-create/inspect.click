-- InspectFlow initial schema
-- Multi-tenant B2B inspection & corrective-action platform.
-- Tenancy boundary is `organizations`; every child table carries organization_id
-- and is locked down with Row Level Security based on organization_members.

create extension if not exists "pgcrypto";

-- =========================================================================
-- PROFILES  (1:1 with auth.users)
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user is created.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- ORGANIZATIONS  &  MEMBERSHIP
-- =========================================================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text,
  country text,
  staff_count text,
  use_case text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'scale')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index organization_members_user_id_idx on public.organization_members(user_id);
create index organization_members_org_id_idx on public.organization_members(organization_id);

-- Helper functions used throughout RLS policies below.
create function public.is_org_member(target_org uuid)
returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org and user_id = auth.uid()
  );
$$;

create function public.is_org_admin(target_org uuid)
returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org and user_id = auth.uid() and role in ('owner', 'admin')
  );
$$;

-- =========================================================================
-- SUBSCRIPTIONS  (one row per organization)
-- =========================================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'scale')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- LOCATIONS / ASSETS
-- =========================================================================
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index locations_org_id_idx on public.locations(organization_id);

-- =========================================================================
-- INSPECTION TEMPLATES  &  ITEMS
-- =========================================================================
create table public.inspection_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inspection_templates_org_id_idx on public.inspection_templates(organization_id);

create table public.template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.inspection_templates(id) on delete cascade,
  label text not null,
  item_type text not null default 'pass_fail' check (item_type in ('pass_fail', 'pass_fail_na', 'text', 'number')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index template_items_template_id_idx on public.template_items(template_id);

-- =========================================================================
-- INSPECTIONS  &  INSPECTION ITEMS
-- =========================================================================
create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  template_id uuid references public.inspection_templates(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'completed')),
  assigned_to uuid references public.profiles(id) on delete set null,
  scheduled_for date,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inspections_org_id_idx on public.inspections(organization_id);
create index inspections_status_idx on public.inspections(organization_id, status);

create table public.inspection_items (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  template_item_id uuid references public.template_items(id) on delete set null,
  label text not null,
  item_type text not null default 'pass_fail' check (item_type in ('pass_fail', 'pass_fail_na', 'text', 'number')),
  result text check (result in ('pass', 'fail', 'na')),
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inspection_items_inspection_id_idx on public.inspection_items(inspection_id);

-- =========================================================================
-- FINDINGS
-- =========================================================================
create table public.findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid references public.inspections(id) on delete cascade,
  inspection_item_id uuid references public.inspection_items(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  title text not null,
  description text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_review', 'resolved')),
  identified_by uuid references public.profiles(id) on delete set null,
  due_date date,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index findings_org_id_idx on public.findings(organization_id);
create index findings_status_idx on public.findings(organization_id, status);

-- =========================================================================
-- CORRECTIVE ACTIONS
-- =========================================================================
create table public.corrective_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  finding_id uuid not null references public.findings(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed')),
  due_date date,
  evidence_notes text,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index corrective_actions_org_id_idx on public.corrective_actions(organization_id);
create index corrective_actions_finding_id_idx on public.corrective_actions(finding_id);
create index corrective_actions_status_idx on public.corrective_actions(organization_id, status);

-- =========================================================================
-- COMMENTS  (generic notes attached to inspections / findings / actions)
-- =========================================================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null check (entity_type in ('inspection', 'finding', 'corrective_action')),
  entity_id uuid not null,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index comments_entity_idx on public.comments(entity_type, entity_id);

-- =========================================================================
-- ATTACHMENTS  (metadata; binary lives in Supabase Storage bucket "attachments")
-- =========================================================================
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null check (entity_type in ('inspection_item', 'finding', 'corrective_action')),
  entity_id uuid not null,
  storage_path text not null,
  file_name text not null,
  content_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index attachments_entity_idx on public.attachments(entity_type, entity_id);

-- =========================================================================
-- REPORTS  (a generated-report record; rendered on demand from live data)
-- =========================================================================
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid references public.inspections(id) on delete cascade,
  title text not null,
  generated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index reports_org_id_idx on public.reports(organization_id);

-- =========================================================================
-- updated_at maintenance trigger
-- =========================================================================
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.organizations for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.inspection_templates for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.inspections for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.inspection_items for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.findings for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.corrective_actions for each row execute procedure public.set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.locations enable row level security;
alter table public.inspection_templates enable row level security;
alter table public.template_items enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_items enable row level security;
alter table public.findings enable row level security;
alter table public.corrective_actions enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;
alter table public.reports enable row level security;

-- PROFILES: a user can read/update only their own profile row. Org-mates
-- are readable too (needed to show "assigned to" names), scoped via a join.
create policy "profiles_self_select" on public.profiles for select
  using (id = auth.uid());

create policy "profiles_orgmates_select" on public.profiles for select
  using (
    exists (
      select 1 from public.organization_members m1
      join public.organization_members m2 on m1.organization_id = m2.organization_id
      where m1.user_id = auth.uid() and m2.user_id = profiles.id
    )
  );

create policy "profiles_self_update" on public.profiles for update
  using (id = auth.uid());

-- ORGANIZATIONS: members can read; only owners/admins can update; any
-- authenticated user can create an organization (they become its owner via
-- application logic immediately after insert).
create policy "organizations_member_select" on public.organizations for select
  using (public.is_org_member(id));

create policy "organizations_authenticated_insert" on public.organizations for insert
  with check (auth.uid() is not null);

create policy "organizations_admin_update" on public.organizations for update
  using (public.is_org_admin(id));

-- ORGANIZATION_MEMBERS: members can see who else is in their org(s).
-- Users can insert their own membership row (used right after org creation).
-- Admins can manage membership (invite/remove/change roles).
create policy "org_members_select" on public.organization_members for select
  using (public.is_org_member(organization_id));

create policy "org_members_self_insert" on public.organization_members for insert
  with check (user_id = auth.uid());

create policy "org_members_admin_insert" on public.organization_members for insert
  with check (public.is_org_admin(organization_id));

create policy "org_members_admin_update" on public.organization_members for update
  using (public.is_org_admin(organization_id));

create policy "org_members_admin_delete" on public.organization_members for delete
  using (public.is_org_admin(organization_id));

-- SUBSCRIPTIONS: members read, admins update.
create policy "subscriptions_member_select" on public.subscriptions for select
  using (public.is_org_member(organization_id));

create policy "subscriptions_admin_upsert" on public.subscriptions for insert
  with check (public.is_org_admin(organization_id));

create policy "subscriptions_admin_update" on public.subscriptions for update
  using (public.is_org_admin(organization_id));

-- Generic "org member can do everything within their org" policy set,
-- applied to every remaining operational table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'locations', 'inspection_templates', 'inspections',
    'findings', 'corrective_actions', 'comments', 'attachments', 'reports'
  ]
  loop
    execute format(
      'create policy "%1$s_member_select" on public.%1$s for select using (public.is_org_member(organization_id));',
      t
    );
    execute format(
      'create policy "%1$s_member_insert" on public.%1$s for insert with check (public.is_org_member(organization_id));',
      t
    );
    execute format(
      'create policy "%1$s_member_update" on public.%1$s for update using (public.is_org_member(organization_id));',
      t
    );
    execute format(
      'create policy "%1$s_member_delete" on public.%1$s for delete using (public.is_org_member(organization_id));',
      t
    );
  end loop;
end;
$$;

-- TEMPLATE_ITEMS: scoped via parent template's organization.
create policy "template_items_member_select" on public.template_items for select
  using (exists (select 1 from public.inspection_templates it where it.id = template_id and public.is_org_member(it.organization_id)));
create policy "template_items_member_insert" on public.template_items for insert
  with check (exists (select 1 from public.inspection_templates it where it.id = template_id and public.is_org_member(it.organization_id)));
create policy "template_items_member_update" on public.template_items for update
  using (exists (select 1 from public.inspection_templates it where it.id = template_id and public.is_org_member(it.organization_id)));
create policy "template_items_member_delete" on public.template_items for delete
  using (exists (select 1 from public.inspection_templates it where it.id = template_id and public.is_org_member(it.organization_id)));

-- INSPECTION_ITEMS: scoped via parent inspection's organization.
create policy "inspection_items_member_select" on public.inspection_items for select
  using (exists (select 1 from public.inspections i where i.id = inspection_id and public.is_org_member(i.organization_id)));
create policy "inspection_items_member_insert" on public.inspection_items for insert
  with check (exists (select 1 from public.inspections i where i.id = inspection_id and public.is_org_member(i.organization_id)));
create policy "inspection_items_member_update" on public.inspection_items for update
  using (exists (select 1 from public.inspections i where i.id = inspection_id and public.is_org_member(i.organization_id)));
create policy "inspection_items_member_delete" on public.inspection_items for delete
  using (exists (select 1 from public.inspections i where i.id = inspection_id and public.is_org_member(i.organization_id)));
