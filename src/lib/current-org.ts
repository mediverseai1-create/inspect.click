import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MemberRole, PlanTier } from "@/types/database";

export interface CurrentOrgContext {
  userId: string;
  userEmail: string;
  fullName: string | null;
  organizationId: string;
  organizationName: string;
  role: MemberRole;
  plan: PlanTier;
}

// Resolves the signed-in user's organization for use in dashboard server
// components. Redirects to sign-in or onboarding if either is missing —
// every dashboard route depends on this, so those states never render.
export async function requireCurrentOrg(): Promise<CurrentOrgContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(name, plan)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership || !membership.organizations) redirect("/onboarding");

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();

  const org = membership.organizations as unknown as { name: string; plan: PlanTier };

  return {
    userId: user.id,
    userEmail: user.email ?? "",
    fullName: profile?.full_name ?? null,
    organizationId: membership.organization_id,
    organizationName: org.name,
    role: membership.role as MemberRole,
    plan: org.plan,
  };
}
