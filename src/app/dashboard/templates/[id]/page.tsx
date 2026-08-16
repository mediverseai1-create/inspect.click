import { notFound } from "next/navigation";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { TemplateDetail } from "@/components/templates/template-detail";
import { ButtonLink } from "@/components/ui/button";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("inspection_templates")
    .select("id, name, description, category")
    .eq("id", id)
    .eq("organization_id", org.organizationId)
    .maybeSingle();

  if (!template) notFound();

  const { data: items } = await supabase
    .from("template_items")
    .select("id, label, item_type, sort_order")
    .eq("template_id", id)
    .order("sort_order", { ascending: true });

  return (
    <>
      <PageHeader
        title={template.name}
        subtitle={template.description || (template.category ?? undefined)}
        action={<ButtonLink href={`/dashboard/inspections/new?template=${template.id}`} variant="amber" className="px-5.5 py-2.5 text-sm">Use this template</ButtonLink>}
      />
      <div className="max-w-[720px]">
        <TemplateDetail templateId={template.id} initialItems={items ?? []} />
      </div>
    </>
  );
}
