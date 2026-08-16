"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSettingsSchema, type OrganizationSettingsInput } from "@/lib/validations/settings";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError, AuthNotice } from "@/components/auth/auth-card";

export function OrganizationForm({
  organizationId,
  name,
  industry,
  country,
  canEdit,
}: {
  organizationId: string;
  name: string;
  industry: string | null;
  country: string | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationSettingsInput>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: { name, industry: industry ?? "", country: country ?? "" },
  });

  const onSubmit = async (data: OrganizationSettingsInput) => {
    setServerError(null);
    setSaved(false);
    const supabase = createClient();
    const { error } = await supabase
      .from("organizations")
      .update({ name: data.name, industry: data.industry || null, country: data.country || null })
      .eq("id", organizationId);
    if (error) {
      setServerError(error.message);
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <Card className="p-6.5">
      <h3 className="text-[17px] mb-4.5">Organization</h3>
      <AuthError>{serverError}</AuthError>
      <AuthNotice>{saved ? "Organization updated." : null}</AuthNotice>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4.5">
          <Label htmlFor="orgName">Company name</Label>
          <Input id="orgName" disabled={!canEdit} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <Label htmlFor="orgIndustry">Industry</Label>
            <Input id="orgIndustry" disabled={!canEdit} {...register("industry")} />
          </div>
          <div>
            <Label htmlFor="orgCountry">Country</Label>
            <Input id="orgCountry" disabled={!canEdit} {...register("country")} />
          </div>
        </div>
        {canEdit ? (
          <Button type="submit" variant="ghost" className="px-5 py-2.5 text-sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <p className="text-[13px] text-ink-55">Only owners and admins can edit organization details.</p>
        )}
      </form>
    </Card>
  );
}
