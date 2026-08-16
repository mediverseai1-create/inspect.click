import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { NewInspectionForm } from "@/components/inspections/new-inspection-form";

export default async function NewInspectionPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const [{ data: templates }, { data: locations }, { data: members }] = await Promise.all([
    supabase.from("inspection_templates").select("id, name").eq("organization_id", org.organizationId).order("name"),
    supabase.from("locations").select("id, name").eq("organization_id", org.organizationId).order("name"),
    supabase
      .from("organization_members")
      .select("user_id, profiles(full_name, email)")
      .eq("organization_id", org.organizationId),
  ]);

  const memberOptions = (members ?? []).map((m) => {
    const profile = m.profiles as unknown as { full_name: string | null; email: string } | null;
    return { id: m.user_id, label: profile?.full_name || profile?.email || "Team member" };
  });

  return (
    <>
      <PageHeader title="New inspection" subtitle="Schedule an inspection and assign it to your team." />
      <div className="max-w-[640px]">
        <NewInspectionForm
          organizationId={org.organizationId}
          templates={templates ?? []}
          locations={locations ?? []}
          members={memberOptions}
          defaultTemplateId={template}
        />
      </div>
    </>
  );
}
