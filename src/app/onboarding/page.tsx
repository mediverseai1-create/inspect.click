import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Logo } from "@/components/ui/logo";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membership) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-paper-dim flex flex-col">
      <div className="px-8 py-6 max-md:px-5">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-[520px]">
          <div className="mb-7">
            <div className="mono text-[12.5px] text-ink-70">Step 1 of 1</div>
            <h1 className="text-[28px] mt-2">Tell us about your business</h1>
            <p className="mt-2 text-[14.5px] text-ink-70">
              This sets up your organization&apos;s workspace in InspectFlow. You can invite teammates afterward.
            </p>
          </div>
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
