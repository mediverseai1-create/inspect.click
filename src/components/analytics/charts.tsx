"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const INK = "#17181D";
const AMBER = "#F5B400";
const PASS = "#2F6F4E";
const FAIL = "#B14A29";
const LINE = "#DED5C0";

export function InspectionsOverTimeChart({ data }: { data: { week: string; completed: number; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={LINE} vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#2a2b33" }} axisLine={{ stroke: LINE }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#2a2b33" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 13 }} />
        <Bar dataKey="total" name="Scheduled" fill={LINE} radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" name="Completed" fill={INK} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SeverityPieChart({ data }: { data: { name: string; value: number }[] }) {
  const colors: Record<string, string> = { High: FAIL, Medium: AMBER, Low: PASS };
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <p className="text-[13.5px] text-ink-55 py-8 text-center">No findings recorded yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={colors[d.name]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${LINE}`, fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
