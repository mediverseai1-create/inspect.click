import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, Badge } from "@/components/ui/card";
import { FindingStatusEditor } from "@/components/findings/finding-status-editor";
import { AddActionPanel } from "@/components/corrective-actions/add-action-panel";
import { CommentsPanel } from "@/components/comments/comments-panel";
import { formatDate } from "@/lib/utils";

const severityTone: Record<string, "neutral" | "fail" | "pending"> = { low: "neutral", medium: "pending", high: "fail" };

export default async function FindingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: finding } = await supabase
    .from("findings")
    .select("id, title, description, severity, status, due_date, created_at, inspection_id, locations(name), inspections(title)")
    .eq("id", id)
    .eq("organization_id", org.organizationId)
    .maybeSingle();

  if (!finding) notFound();

  const [{ data: actions }, { data: comments }, { data: members }] = await Promise.all([
    supabase
      .from("corrective_actions")
      .select("id, title, priority, status, due_date, profiles!corrective_actions_assigned_to_fkey(full_name, email)")
      .eq("finding_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("comments")
      .select("id, body, created_at, profiles!comments_author_id_fkey(full_name, email)")
      .eq("entity_type", "finding")
      .eq("entity_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("organization_members")
      .select("user_id, profiles(full_name, email)")
      .eq("organization_id", org.organizationId),
  ]);

  const memberOptions = (members ?? []).map((m) => {
    const profile = m.profiles as unknown as { full_name: string | null; email: string } | null;
    return { id: m.user_id, label: profile?.full_name || profile?.email || "Team member" };
  });

  const actionRows = (actions ?? []).map((a) => {
    const assignee = a.profiles as unknown as { full_name: string | null; email: string } | null;
    return {
      id: a.id,
      title: a.title,
      priority: a.priority,
      status: a.status,
      due_date: a.due_date,
      assignee_label: assignee ? assignee.full_name || assignee.email : null,
    };
  });

  const commentRows = (comments ?? []).map((c) => {
    const author = c.profiles as unknown as { full_name: string | null; email: string } | null;
    return { id: c.id, body: c.body, created_at: c.created_at, author_label: author ? author.full_name || author.email : "Someone" };
  });

  const location = finding.locations as unknown as { name: string } | null;
  const inspection = finding.inspections as unknown as { title: string } | null;

  return (
    <>
      <PageHeader
        title={finding.title}
        subtitle={[location?.name, `Identified ${formatDate(finding.created_at)}`].filter(Boolean).join(" · ")}
        action={<Badge tone={severityTone[finding.severity]}>{finding.severity.toUpperCase()} SEVERITY</Badge>}
      />

      <div className="grid grid-cols-[1fr_300px] max-lg:grid-cols-1 gap-6">
        <div className="flex flex-col gap-5">
          <Card className="p-5.5">
            {finding.description ? (
              <p className="text-[14.5px] text-ink-70">{finding.description}</p>
            ) : (
              <p className="text-[13.5px] text-ink-55">No description recorded.</p>
            )}
            {inspection && finding.inspection_id && (
              <Link href={`/dashboard/inspections/${finding.inspection_id}`} className="inline-block mt-3 text-[13.5px] font-semibold text-ink no-underline">
                View inspection: {inspection.title} →
              </Link>
            )}
          </Card>

          <AddActionPanel
            organizationId={org.organizationId}
            findingId={finding.id}
            userId={org.userId}
            members={memberOptions}
            initialActions={actionRows}
          />

          <CommentsPanel organizationId={org.organizationId} entityType="finding" entityId={finding.id} initialComments={commentRows} />
        </div>

        <div className="flex flex-col gap-4">
          <FindingStatusEditor findingId={finding.id} severity={finding.severity} status={finding.status} />
        </div>
      </div>
    </>
  );
}
