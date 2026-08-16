"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/inspections", label: "Inspections" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/findings", label: "Findings" },
  { href: "/dashboard/corrective-actions", label: "Corrective Actions" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({
  orgName,
  plan,
  userLabel,
  children,
}: {
  orgName: string;
  plan: string;
  userLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar orgName={orgName} plan={plan} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-line bg-paper-card">
          <button className="md:hidden p-1.5 bg-transparent border-none" aria-label="Open menu" onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#17181D" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="md:hidden"><Logo /></div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <span className="text-[13.5px] text-ink-70 max-md:hidden">{userLabel}</span>
            <button onClick={signOut} className="text-[13.5px] font-semibold text-ink bg-transparent border-none cursor-pointer">
              Sign out
            </button>
          </div>
        </header>

        {open && (
          <div className="md:hidden fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
            <div className="bg-paper-card w-[78%] max-w-[300px] h-full p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <Logo />
                <button onClick={() => setOpen(false)} className="bg-transparent border-none p-1" aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 20 20" stroke="#17181D" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l12 12M16 4L4 16" /></svg>
                </button>
              </div>
              <div className="text-[13px] font-semibold">{orgName}</div>
              <div className="mono text-[10.5px] text-ink-55 mt-0.5 mb-5">{plan.toUpperCase()} PLAN</div>
              <nav className="flex flex-col gap-0.5">
                {NAV.map((item) => {
                  const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-2.75 rounded-[10px] text-[14.5px] font-medium no-underline ${active ? "bg-ink text-paper" : "text-ink-70"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-5 md:p-8 max-w-[1240px] w-full">{children}</main>
      </div>
    </div>
  );
}
