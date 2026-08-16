import Link from "next/link";
import { Suspense } from "react";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, Badge } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FindingsFilterBar } from "@/components/findings/filter-bar";
import type { FindingStatus, Severity } from "@/types/database";

const severityTone: Record<string, "neutral" | "fail" | "pending"> = { low: "neutral", medium: "pending", high: "fail" };
const statusTone: Record<string, "neutral" | "pass" | "pending"> = { open: "pending", in_review: "neutral", resolved: "pass" };

export default async function FindingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; severity?: string }>;
}) {
  const { status, severity } = await searchParams;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  let query = supabase
    .from("findings")
    .select("id, title, severity, status, due_date, created_at, locations(name), inspections(title)")
    .eq("organization_id", org.organizationId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status as FindingStatus);
  if (severity) query = query.eq("severity", severity as Severity);

  const { data: findings } = await query;

  return (
    <>
      <PageHeader title="Findings" subtitle="Every failed item, tracked from discovery to resolution." />

      <Suspense fallback={null}>
        <FindingsFilterBar />
      </Suspense>

      {findings && findings.length > 0 ? (
        <Card className="overflow-hidden overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">FINDING</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">LOCATION</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">DUE</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">SEVERITY</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px] text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.id} className="border-b border-line last:border-b-0 hover:bg-paper-dim/40">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/findings/${f.id}`} className="font-medium text-ink no-underline hover:underline">{f.title}</Link>
                    {f.inspections && <div className="text-[12px] text-ink-55 mt-0.5">{(f.inspections as unknown as { title: string }).title}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-ink-70">{(f.locations as unknown as { name: string } | null)?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-ink-70">{f.due_date ? formatDate(f.due_date) : "—"}</td>
                  <td className="px-5 py-3.5"><Badge tone={severityTone[f.severity]}>{f.severity.toUpperCase()}</Badge></td>
                  <td className="px-5 py-3.5 text-right"><Badge tone={statusTone[f.status]}>{f.status.replace("_", " ").toUpperCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState title="No findings yet" description="Findings are created automatically when a checklist item fails during an inspection." />
      )}
    </>
  );
}
