import Link from "next/link";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function ReportsPage() {
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, title, created_at, inspections(status)")
    .eq("organization_id", org.organizationId)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="A generated, exportable record of every completed inspection."
        action={<ButtonLink href="/dashboard/reports/new" variant="amber" className="px-5.5 py-2.5 text-sm">Generate report</ButtonLink>}
      />

      {reports && reports.length > 0 ? (
        <Card className="overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/reports/${r.id}`} className="font-medium text-ink no-underline hover:underline">{r.title}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-right text-[12.5px] text-ink-55">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState
          title="No reports yet"
          description="Generate a report from any completed inspection to get a shareable record of results, findings, and corrective actions."
          action={<ButtonLink href="/dashboard/reports/new" variant="ink">Generate a report</ButtonLink>}
        />
      )}
    </>
  );
}
