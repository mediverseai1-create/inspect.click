"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations/settings";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError, AuthNotice } from "@/components/auth/auth-card";

export function ProfileForm({ userId, email, fullName }: { userId: string; email: string; fullName: string | null }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: { fullName: fullName ?? "" } });

  const onSubmit = async (data: ProfileInput) => {
    setServerError(null);
    setSaved(false);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ full_name: data.fullName }).eq("id", userId);
    if (error) {
      setServerError(error.message);
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <Card className="p-6.5">
      <h3 className="text-[17px] mb-4.5">Your profile</h3>
      <AuthError>{serverError}</AuthError>
      <AuthNotice>{saved ? "Profile updated." : null}</AuthNotice>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register("fullName")} />
          <FieldError>{errors.fullName?.message}</FieldError>
        </div>
        <div className="mb-5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled />
        </div>
        <Button type="submit" variant="ghost" className="px-5 py-2.5 text-sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
