import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, Badge } from "@/components/ui/card";
import { InspectionConductor } from "@/components/inspections/inspection-conductor";
import { formatDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const statusTone: Record<string, "neutral" | "pass" | "pending"> = {
  draft: "neutral",
  in_progress: "pending",
  completed: "pass",
};

export default async function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: inspection } = await supabase
    .from("inspections")
    .select("id, title, status, scheduled_for, completed_at, location_id, locations(name), profiles!inspections_assigned_to_fkey(full_name, email)")
    .eq("id", id)
    .eq("organization_id", org.organizationId)
    .maybeSingle();

  if (!inspection) notFound();

  const { data: items } = await supabase
    .from("inspection_items")
    .select("id, label, item_type, result, notes, sort_order")
    .eq("inspection_id", id)
    .order("sort_order", { ascending: true });

  const { data: findings } = await supabase
    .from("findings")
    .select("id, title, severity, status")
    .eq("inspection_id", id);

  const assignee = inspection.profiles as unknown as { full_name: string | null; email: string } | null;
  const location = inspection.locations as unknown as { name: string } | null;

  return (
    <>
      <PageHeader
        title={inspection.title}
        subtitle={[location?.name, assignee ? `Assigned to ${assignee.full_name || assignee.email}` : null]
          .filter(Boolean)
          .join(" · ")}
        action={
          <div className="flex items-center gap-3">
            <Badge tone={statusTone[inspection.status]}>{inspection.status.replace("_", " ").toUpperCase()}</Badge>
            {inspection.status === "completed" && (
              <ButtonLink href={`/dashboard/reports/new?inspection=${inspection.id}`} variant="ghost" className="px-4 py-2 text-[13px]">
                Generate report
              </ButtonLink>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-[1fr_300px] max-lg:grid-cols-1 gap-6">
        <div>
          <InspectionConductor
            inspectionId={inspection.id}
            organizationId={org.organizationId}
            locationId={inspection.location_id}
            status={inspection.status}
            userId={org.userId}
            initialItems={items ?? []}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5.5">
            <h4 className="text-[14px] mb-3">Details</h4>
            <dl className="text-[13.5px] flex flex-col gap-2.5">
              <div className="flex justify-between"><dt className="text-ink-55">Scheduled</dt><dd>{inspection.scheduled_for ? formatDate(inspection.scheduled_for) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-55">Completed</dt><dd>{inspection.completed_at ? formatDate(inspection.completed_at) : "—"}</dd></div>
            </dl>
          </Card>

          <Card className="p-5.5">
            <h4 className="text-[14px] mb-3">Findings from this inspection</h4>
            {findings && findings.length > 0 ? (
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {findings.map((f) => (
                  <li key={f.id}>
                    <Link href={`/dashboard/findings/${f.id}`} className="text-[13.5px] text-ink no-underline hover:underline">
                      {f.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-ink-55">No findings yet.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
