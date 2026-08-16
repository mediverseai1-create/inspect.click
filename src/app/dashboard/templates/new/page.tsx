import { requireCurrentOrg } from "@/lib/current-org";
import { PageHeader } from "@/components/dashboard/page-header";
import { TemplateForm } from "@/components/templates/template-form";

export default async function NewTemplatePage() {
  const org = await requireCurrentOrg();

  return (
    <>
      <PageHeader title="New inspection template" subtitle="Build the checklist once — reuse it for every inspection." />
      <div className="max-w-[720px]">
        <TemplateForm organizationId={org.organizationId} />
      </div>
    </>
  );
}
