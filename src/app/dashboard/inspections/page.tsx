import Link from "next/link";
import { Suspense } from "react";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, Badge } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { InspectionsFilterBar } from "@/components/inspections/filter-bar";
import type { InspectionStatus } from "@/types/database";

const statusTone: Record<string, "neutral" | "pass" | "pending"> = {
  draft: "neutral",
  in_progress: "pending",
  completed: "pass",
};

export default async function InspectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const { q, status, sort } = await searchParams;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  let query = supabase
    .from("inspections")
    .select("id, title, status, scheduled_for, updated_at, locations(name), profiles!inspections_assigned_to_fkey(full_name, email)")
    .eq("organization_id", org.organizationId);

  if (q) query = query.ilike("title", `%${q}%`);
  if (status) query = query.eq("status", status as InspectionStatus);

  const sortColumn = sort === "oldest" ? "updated_at" : sort === "title" ? "title" : "updated_at";
  const ascending = sort === "oldest" || sort === "title";
  query = query.order(sortColumn, { ascending });

  const { data: inspections } = await query;

  return (
    <>
      <PageHeader
        title="Inspections"
        subtitle="Every scheduled, in-progress, and completed inspection."
        action={<ButtonLink href="/dashboard/inspections/new" variant="amber" className="px-5.5 py-2.5 text-sm">New inspection</ButtonLink>}
      />

      <Suspense fallback={null}>
        <InspectionsFilterBar />
      </Suspense>

      {inspections && inspections.length > 0 ? (
        <Card className="overflow-hidden overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">TITLE</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">LOCATION</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">ASSIGNED</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px]">SCHEDULED</th>
                <th className="px-5 py-3 font-medium text-ink-55 text-[12.5px] text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((i) => (
                <tr key={i.id} className="border-b border-line last:border-b-0 hover:bg-paper-dim/40">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/inspections/${i.id}`} className="font-medium text-ink no-underline hover:underline">
                      {i.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink-70">{(i.locations as unknown as { name: string } | null)?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-ink-70">
                    {(i.profiles as unknown as { full_name: string | null; email: string } | null)?.full_name ??
                      (i.profiles as unknown as { full_name: string | null; email: string } | null)?.email ?? "Unassigned"}
                  </td>
                  <td className="px-5 py-3.5 text-ink-70">{i.scheduled_for ? formatDate(i.scheduled_for) : "—"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge tone={statusTone[i.status]}>{i.status.replace("_", " ").toUpperCase()}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState
          title={q || status ? "No inspections match your filters" : "No inspections yet"}
          description={q || status ? "Try a different search term or clear your filters." : "Schedule your first inspection to get started."}
          action={!q && !status ? <ButtonLink href="/dashboard/inspections/new" variant="ink">New inspection</ButtonLink> : undefined}
        />
      )}
    </>
  );
}
