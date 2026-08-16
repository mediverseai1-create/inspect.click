import { startOfWeek, subWeeks, format, isWithinInterval, endOfWeek } from "date-fns";
import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { InspectionsOverTimeChart, SeverityPieChart } from "@/components/analytics/charts";

export default async function AnalyticsPage() {
  const org = await requireCurrentOrg();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: inspections }, { data: findings }, { data: actions }] = await Promise.all([
    supabase.from("inspections").select("id, status, scheduled_for, completed_at, created_at").eq("organization_id", org.organizationId),
    supabase.from("findings").select("id, severity, status, created_at, resolved_at").eq("organization_id", org.organizationId),
    supabase.from("corrective_actions").select("id, status, due_date").eq("organization_id", org.organizationId),
  ]);

  const weeks = Array.from({ length: 8 }).map((_, idx) => {
    const start = startOfWeek(subWeeks(new Date(), 7 - idx), { weekStartsOn: 1 });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    const inRange = (d: string) => isWithinInterval(new Date(d), { start, end });
    const total = (inspections ?? []).filter((i) => inRange(i.created_at)).length;
    const completed = (inspections ?? []).filter((i) => i.completed_at && inRange(i.completed_at)).length;
    return { week: format(start, "MMM d"), total, completed };
  });

  const severityData = [
    { name: "High", value: (findings ?? []).filter((f) => f.severity === "high").length },
    { name: "Medium", value: (findings ?? []).filter((f) => f.severity === "medium").length },
    { name: "Low", value: (findings ?? []).filter((f) => f.severity === "low").length },
  ];

  const totalFindings = findings?.length ?? 0;
  const resolvedFindings = (findings ?? []).filter((f) => f.status === "resolved").length;
  const resolutionRate = totalFindings > 0 ? Math.round((resolvedFindings / totalFindings) * 100) : 0;

  const totalActions = actions?.length ?? 0;
  const completedActions = (actions ?? []).filter((a) => a.status === "completed").length;
  const overdueActions = (actions ?? []).filter((a) => a.status !== "completed" && a.due_date && a.due_date < today).length;
  const actionCompletionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Trends computed from your organization's actual inspection data." />

      <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5"><div className="font-serif text-[28px]">{totalFindings}</div><div className="text-[12.5px] text-ink-55 mt-1">Total findings</div></Card>
        <Card className="p-5"><div className="font-serif text-[28px]">{resolutionRate}%</div><div className="text-[12.5px] text-ink-55 mt-1">Findings resolved</div></Card>
        <Card className="p-5"><div className="font-serif text-[28px]">{actionCompletionRate}%</div><div className="text-[12.5px] text-ink-55 mt-1">Actions completed</div></Card>
        <Card className="p-5"><div className="font-serif text-[28px] text-fail">{overdueActions}</div><div className="text-[12.5px] text-ink-55 mt-1">Actions overdue</div></Card>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] max-lg:grid-cols-1 gap-5">
        <Card className="p-6.5">
          <h3 className="text-[15px] mb-4">Inspections — last 8 weeks</h3>
          <InspectionsOverTimeChart data={weeks} />
        </Card>
        <Card className="p-6.5">
          <h3 className="text-[15px] mb-4">Findings by severity</h3>
          <SeverityPieChart data={severityData} />
        </Card>
      </div>
    </>
  );
}
