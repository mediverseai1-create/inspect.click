import { requireCurrentOrg } from "@/lib/current-org";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { OrganizationForm } from "@/components/settings/organization-form";
import { LocationsManager } from "@/components/settings/locations-manager";
import { PlanCard } from "@/components/settings/plan-card";
import { Card } from "@/components/ui/card";
import type { PlanId } from "@/lib/payment-links";

export default async function SettingsPage() {
  const org = await requireCurrentOrg();
  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, industry, country")
    .eq("id", org.organizationId)
    .maybeSingle();

  const { data: locations } = await supabase
    .from("locations")
    .select("id, name, address")
    .eq("organization_id", org.organizationId)
    .order("name");

  const canEdit = org.role === "owner" || org.role === "admin";

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile, organization, and plan." />
      <div className="max-w-[680px] flex flex-col gap-5">
        <ProfileForm userId={org.userId} email={org.userEmail} fullName={org.fullName} />
        <OrganizationForm
          organizationId={org.organizationId}
          name={organization?.name ?? org.organizationName}
          industry={organization?.industry ?? null}
          country={organization?.country ?? null}
          canEdit={canEdit}
        />
        <LocationsManager organizationId={org.organizationId} initialLocations={locations ?? []} plan={org.plan as PlanId} />
        <PlanCard currentPlan={org.plan as PlanId} />

        <Card className="p-6.5">
          <h3 className="text-[17px] mb-2">AI Inspection Assistant</h3>
          <p className="text-[13.5px] text-ink-70">
            {process.env.AI_PROVIDER_API_KEY
              ? "Connected. Ask questions about your inspection data from the Overview dashboard."
              : "Coming soon. Add an AI_PROVIDER_API_KEY to enable the AI Inspection Assistant for this workspace."}
          </p>
        </Card>
      </div>
    </>
  );
}
