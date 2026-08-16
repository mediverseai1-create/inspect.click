-- Storage bucket for inspection evidence (photos, documents).
-- Objects are stored at: attachments/{organization_id}/{uuid}-{filename}
-- so RLS can key off the first path segment.

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "attachments_org_member_select" on storage.objects for select
  using (
    bucket_id = 'attachments'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "attachments_org_member_insert" on storage.objects for insert
  with check (
    bucket_id = 'attachments'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "attachments_org_member_delete" on storage.objects for delete
  using (
    bucket_id = 'attachments'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );
