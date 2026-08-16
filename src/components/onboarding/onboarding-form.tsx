"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingInput, INDUSTRIES, STAFF_COUNTS, USE_CASES } from "@/lib/validations/onboarding";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/auth-card";

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "org"}-${suffix}`;
}

export function OnboardingForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({ resolver: zodResolver(onboardingSchema) });

  const onSubmit = async (data: OnboardingInput) => {
    setServerError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setServerError("Your session expired. Please log in again.");
      return;
    }

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: data.companyName,
        slug: slugify(data.companyName),
        industry: data.industry,
        country: data.country,
        staff_count: data.staffCount,
        use_case: data.useCase,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (orgError || !org) {
      setServerError(orgError?.message ?? "Couldn't create your organization. Try again.");
      return;
    }

    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({ organization_id: org.id, user_id: user.id, role: "owner" });

    if (memberError) {
      setServerError(memberError.message);
      return;
    }

    await supabase.from("subscriptions").insert({ organization_id: org.id, plan: "free" });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="p-8.5 max-md:p-6.5">
      <AuthError>{serverError}</AuthError>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" placeholder="Acme Facilities Co." {...register("companyName")} />
          <FieldError>{errors.companyName?.message}</FieldError>
        </div>

        <div className="mb-4.5">
          <Label htmlFor="industry">Industry</Label>
          <Select id="industry" defaultValue="" {...register("industry")}>
            <option value="" disabled>Select an industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </Select>
          <FieldError>{errors.industry?.message}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4.5">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="United States" {...register("country")} />
            <FieldError>{errors.country?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="staffCount">Company size</Label>
            <Select id="staffCount" defaultValue="" {...register("staffCount")}>
              <option value="" disabled>Select size</option>
              {STAFF_COUNTS.map((s) => (
                <option key={s} value={s}>{s} employees</option>
              ))}
            </Select>
            <FieldError>{errors.staffCount?.message}</FieldError>
          </div>
        </div>

        <div className="mb-7">
          <Label htmlFor="useCase">What will you mostly inspect?</Label>
          <Select id="useCase" defaultValue="" {...register("useCase")}>
            <option value="" disabled>Select a use case</option>
            {USE_CASES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
          <FieldError>{errors.useCase?.message}</FieldError>
        </div>

        <Button type="submit" variant="amber" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Setting up your workspace…" : "Create workspace"}
        </Button>
      </form>
    </Card>
  );
}
