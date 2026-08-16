import { requireCurrentOrg } from "@/lib/current-org";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const org = await requireCurrentOrg();

  return (
    <DashboardShell
      orgName={org.organizationName}
      plan={org.plan}
      userLabel={org.fullName || org.userEmail}
    >
      {children}
    </DashboardShell>
  );
}
