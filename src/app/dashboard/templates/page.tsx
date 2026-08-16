import Link from "next/link";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function TemplatesPage() {
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from("inspection_templates")
    .select("id, name, description, category, created_at, template_items(id)")
    .eq("organization_id", org.organizationId)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Inspection Templates"
        subtitle="Reusable checklists for each facility, machine, or process."
        action={<ButtonLink href="/dashboard/templates/new" variant="amber" className="px-5.5 py-2.5 text-sm">New template</ButtonLink>}
      />

      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {templates.map((t) => (
            <Link key={t.id} href={`/dashboard/templates/${t.id}`} className="no-underline text-ink">
              <Card className="p-6 h-full hover:-translate-y-0.5 transition-transform">
                {t.category && <div className="mono text-[10.5px] text-ink-55 mb-2">{t.category.toUpperCase()}</div>}
                <h3 className="text-lg">{t.name}</h3>
                {t.description && <p className="mt-1.5 text-[13.5px] text-ink-70 line-clamp-2">{t.description}</p>}
                <div className="mt-4 flex items-center justify-between text-[12.5px] text-ink-55">
                  <span>{t.template_items?.length ?? 0} checklist items</span>
                  <span>{formatDate(t.created_at)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No templates yet"
          description="Create a reusable checklist once, then use it for every recurring inspection at that location."
          action={<ButtonLink href="/dashboard/templates/new" variant="ink">Create your first template</ButtonLink>}
        />
      )}
    </>
  );
}
