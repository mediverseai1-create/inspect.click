import Link from "next/link";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, Badge } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AiAssistantWidget } from "@/components/dashboard/ai-assistant-widget";
import { formatDate } from "@/lib/utils";

export default async function OverviewPage() {
  const org = await requireCurrentOrg();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    totalInspections,
    completedInspections,
    pendingInspections,
    openFindings,
    resolvedFindings,
    overdueActions,
    recentInspections,
  ] = await Promise.all([
    supabase.from("inspections").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId),
    supabase.from("inspections").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId).eq("status", "completed"),
    supabase.from("inspections").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId).in("status", ["draft", "in_progress"]),
    supabase.from("findings").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId).in("status", ["open", "in_review"]),
    supabase.from("findings").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId).eq("status", "resolved"),
    supabase.from("corrective_actions").select("id", { count: "exact", head: true }).eq("organization_id", org.organizationId).neq("status", "completed").lt("due_date", today),
    supabase
      .from("inspections")
      .select("id, title, status, updated_at, locations(name)")
      .eq("organization_id", org.organizationId)
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const total = totalInspections.count ?? 0;
  const completed = completedInspections.count ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total inspections", value: total },
    { label: "Completed", value: completed },
    { label: "Pending", value: pendingInspections.count ?? 0 },
    { label: "Open findings", value: openFindings.count ?? 0 },
    { label: "Resolved findings", value: resolvedFindings.count ?? 0 },
    { label: "Overdue corrective actions", value: overdueActions.count ?? 0 },
  ];

  const statusTone: Record<string, "neutral" | "pass" | "pending"> = {
    draft: "neutral",
    in_progress: "pending",
    completed: "pass",
  };

  return (
    <>
      <PageHeader
        title={`Welcome back${org.fullName ? `, ${org.fullName.split(" ")[0]}` : ""}`}
        subtitle={`${org.organizationName} — here's what's happening across your inspections.`}
        action={<ButtonLink href="/dashboard/inspections/new" variant="amber" className="px-5.5 py-2.5 text-sm">New inspection</ButtonLink>}
      />

      {org.plan === "free" && (
        <Card className="px-6 py-4.5 mb-6 flex items-center justify-between gap-4 flex-wrap bg-ink text-paper">
          <p className="text-[13.5px] text-paper/80">
            You&apos;re on the Free plan — 1 location and up to 2 templates. Upgrade for more locations and the AI Inspection Assistant.
          </p>
          <ButtonLink href="/dashboard/settings" variant="amber" className="px-4.5 py-2 text-[13px]">View plans</ButtonLink>
        </Card>
      )}

      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="px-5 py-5">
            <div className="font-serif text-[32px]">{s.value}</div>
            <div className="mt-1 text-[13px] text-ink-55">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="px-6 py-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-semibold">Inspection completion rate</h3>
          <span className="font-mono text-sm">{completionRate}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-paper-dim overflow-hidden">
          <div className="h-full bg-amber rounded-full" style={{ width: `${completionRate}%` }} />
        </div>
      </Card>

      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg">Recent inspection activity</h3>
        <Link href="/dashboard/inspections" className="text-[13.5px] font-semibold text-ink no-underline">View all →</Link>
      </div>

      {recentInspections.data && recentInspections.data.length > 0 ? (
        <Card className="overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {recentInspections.data.map((i) => (
                <tr key={i.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/inspections/${i.id}`} className="font-medium text-ink no-underline hover:underline">
                      {i.title}
                    </Link>
                    {i.locations && <div className="text-[12.5px] text-ink-55 mt-0.5">{(i.locations as unknown as { name: string }).name}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[12.5px] text-ink-55">{formatDate(i.updated_at)}</td>
                  <td className="px-5 py-3.5 text-right w-[120px]">
                    <Badge tone={statusTone[i.status]}>{i.status.replace("_", " ").toUpperCase()}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState
          title="No inspections yet"
          description="Create your first inspection template, then schedule an inspection to start tracking findings."
          action={<ButtonLink href="/dashboard/templates/new" variant="ink">Create a template</ButtonLink>}
        />
      )}

      <div className="mt-8">
        <AiAssistantWidget />
      </div>
    </>
  );
}
