import { notFound } from "next/navigation";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, Badge } from "@/components/ui/card";
import { PrintButton } from "@/components/reports/print-button";
import { formatDate, formatDateTime } from "@/lib/utils";

const severityTone: Record<string, "neutral" | "fail" | "pending"> = { low: "neutral", medium: "pending", high: "fail" };
const resultTone: Record<string, "neutral" | "pass" | "fail"> = { pass: "pass", fail: "fail", na: "neutral" };

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .select("id, title, created_at, inspection_id")
    .eq("id", id)
    .eq("organization_id", org.organizationId)
    .maybeSingle();

  if (!report || !report.inspection_id) notFound();

  const { data: inspection } = await supabase
    .from("inspections")
    .select("id, title, status, scheduled_for, started_at, completed_at, locations(name), profiles!inspections_assigned_to_fkey(full_name, email)")
    .eq("id", report.inspection_id)
    .maybeSingle();

  const { data: items } = await supabase
    .from("inspection_items")
    .select("id, label, item_type, result, notes, sort_order")
    .eq("inspection_id", report.inspection_id)
    .order("sort_order", { ascending: true });

  const { data: findings } = await supabase
    .from("findings")
    .select("id, title, severity, status, description, corrective_actions(id, title, status, priority, due_date)")
    .eq("inspection_id", report.inspection_id);

  if (!inspection) notFound();

  const location = inspection.locations as unknown as { name: string } | null;
  const assignee = inspection.profiles as unknown as { full_name: string | null; email: string } | null;
  const passCount = (items ?? []).filter((i) => i.result === "pass").length;
  const failCount = (items ?? []).filter((i) => i.result === "fail").length;

  return (
    <>
      <PageHeader title={report.title} subtitle={`Generated ${formatDateTime(report.created_at)}`} action={<PrintButton />} />

      <div className="max-w-[760px] flex flex-col gap-5 print:max-w-none">
        <Card className="p-7">
          <h2 className="text-xl mb-4">{inspection.title}</h2>
          <dl className="grid grid-cols-2 gap-4 text-[13.5px]">
            <div><dt className="text-ink-55">Location</dt><dd className="font-medium mt-0.5">{location?.name ?? "—"}</dd></div>
            <div><dt className="text-ink-55">Inspector</dt><dd className="font-medium mt-0.5">{assignee ? assignee.full_name || assignee.email : "Unassigned"}</dd></div>
            <div><dt className="text-ink-55">Scheduled</dt><dd className="font-medium mt-0.5">{inspection.scheduled_for ? formatDate(inspection.scheduled_for) : "—"}</dd></div>
            <div><dt className="text-ink-55">Completed</dt><dd className="font-medium mt-0.5">{inspection.completed_at ? formatDateTime(inspection.completed_at) : "—"}</dd></div>
          </dl>
          <div className="flex gap-3 mt-5">
            <Badge tone="pass">{passCount} PASSED</Badge>
            <Badge tone="fail">{failCount} FAILED</Badge>
          </div>
        </Card>

        <Card className="p-7">
          <h3 className="text-[17px] mb-4">Checklist results</h3>
          <div className="flex flex-col">
            {(items ?? []).map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3 py-3 border-b border-paper-dim last:border-b-0">
                <span className="font-mono text-[11px] text-ink-55 mt-0.5">{idx + 1}</span>
                <div className="flex-1">
                  <div className="text-[14px] font-medium">{item.label}</div>
                  {item.notes && <div className="text-[13px] text-ink-70 mt-1">{item.notes}</div>}
                </div>
                {item.result && <Badge tone={resultTone[item.result]}>{item.result.toUpperCase()}</Badge>}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-7">
          <h3 className="text-[17px] mb-4">Findings & corrective actions</h3>
          {findings && findings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {findings.map((f) => (
                <div key={f.id} className="border-b border-paper-dim pb-4 last:border-b-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[14.5px] font-medium">{f.title}</span>
                    <Badge tone={severityTone[f.severity]}>{f.severity.toUpperCase()}</Badge>
                  </div>
                  {f.description && <p className="text-[13.5px] text-ink-70 mb-2">{f.description}</p>}
                  {(f.corrective_actions as unknown as { id: string; title: string; status: string; priority: string; due_date: string | null }[])?.length > 0 && (
                    <ul className="list-none p-0 m-0 pl-4 border-l-2 border-line">
                      {(f.corrective_actions as unknown as { id: string; title: string; status: string; priority: string; due_date: string | null }[]).map((a) => (
                        <li key={a.id} className="text-[13px] text-ink-70 py-1">
                          {a.title} — {a.status.replace("_", " ")}{a.due_date ? `, due ${formatDate(a.due_date)}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] text-ink-55">No findings recorded for this inspection.</p>
          )}
        </Card>
      </div>
    </>
  );
}
