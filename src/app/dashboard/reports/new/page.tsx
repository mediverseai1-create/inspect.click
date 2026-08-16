import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { NewReportForm } from "@/components/reports/new-report-form";

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ inspection?: string }>;
}) {
  const { inspection } = await searchParams;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: inspections } = await supabase
    .from("inspections")
    .select("id, title")
    .eq("organization_id", org.organizationId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  return (
    <>
      <PageHeader title="Generate report" subtitle="Reports are built from a completed inspection's real results." />
      <div className="max-w-[560px]">
        <NewReportForm organizationId={org.organizationId} inspections={inspections ?? []} defaultInspectionId={inspection} />
      </div>
    </>
  );
}
