import { Suspense } from "react";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { ActionRow, type ActionRowData } from "@/components/corrective-actions/action-row";
import { ActionsFilterBar } from "@/components/corrective-actions/filter-bar";
import type { ActionStatus } from "@/types/database";

export default async function CorrectiveActionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  let query = supabase
    .from("corrective_actions")
    .select("id, title, priority, status, due_date, findings(title), profiles!corrective_actions_assigned_to_fkey(full_name, email)")
    .eq("organization_id", org.organizationId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status as ActionStatus);

  const { data: actions } = await query;

  const rows: ActionRowData[] = (actions ?? []).map((a) => {
    const assignee = a.profiles as unknown as { full_name: string | null; email: string } | null;
    const finding = a.findings as unknown as { title: string } | null;
    return {
      id: a.id,
      title: a.title,
      priority: a.priority,
      status: a.status,
      due_date: a.due_date,
      assignee_label: assignee ? assignee.full_name || assignee.email : null,
      finding_title: finding?.title,
    };
  });

  return (
    <>
      <PageHeader title="Corrective Actions" subtitle="Every fix, assigned and tracked to completion." />
      <Suspense fallback={null}>
        <ActionsFilterBar />
      </Suspense>

      {rows.length > 0 ? (
        <Card className="px-5.5">{rows.map((a) => <ActionRow key={a.id} action={a} showFinding />)}</Card>
      ) : (
        <EmptyState title="No corrective actions yet" description="Corrective actions are created from a finding's detail page." />
      )}
    </>
  );
}
