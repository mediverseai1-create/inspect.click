"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: string; exact?: boolean }[] = [
  { href: "/dashboard", label: "Overview", exact: true, icon: "grid" },
  { href: "/dashboard/inspections", label: "Inspections", icon: "check" },
  { href: "/dashboard/templates", label: "Templates", icon: "doc" },
  { href: "/dashboard/findings", label: "Findings", icon: "flag" },
  { href: "/dashboard/corrective-actions", label: "Corrective Actions", icon: "arrow" },
  { href: "/dashboard/reports", label: "Reports", icon: "report" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "chart" },
  { href: "/dashboard/settings", label: "Settings", icon: "gear" },
];

const icons: Record<string, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  check: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12l2.5 2.5L16 9" /></>,
  doc: <><path d="M6 2h9l4 4v16H6z" /><path d="M9 12h6M9 16h6" /></>,
  flag: <><path d="M5 3v18" /><path d="M5 4h11l-3 4 3 4H5" /></>,
  arrow: <><path d="M4 7h11M4 12h7M4 17h11" /><path d="M18 4l3 3-3 3" /></>,
  report: <><path d="M6 2h9l4 4v16H6z" /><path d="M9 12h6M9 15h6M9 9h2" /></>,
  chart: <><path d="M4 20V10M11 20V4M18 20v-7" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
};

export function Sidebar({ orgName, plan }: { orgName: string; plan: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[248px] md:flex-none flex-col border-r border-line bg-paper-card h-screen sticky top-0">
      <div className="px-6 py-6">
        <Logo />
      </div>
      <div className="px-6 pb-4">
        <div className="text-[13px] font-semibold truncate">{orgName}</div>
        <div className="mono text-[10.5px] text-ink-55 mt-0.5">{plan.toUpperCase()} PLAN</div>
      </div>
      <nav className="flex-1 px-3.5 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium no-underline transition-colors",
                active ? "bg-ink text-paper" : "text-ink-70 hover:bg-paper-dim hover:text-ink"
              )}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                {icons[item.icon]}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-5 border-t border-line">
        <Link href="/" className="text-[13px] text-ink-55 no-underline">← Back to site</Link>
      </div>
    </aside>
  );
}
