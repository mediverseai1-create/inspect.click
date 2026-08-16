"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { AuthCard, AuthError } from "@/components/auth/auth-card";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: SignInInput) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setServerError(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
      return;
    }

    router.push(searchParams.get("redirect") || "/dashboard");
    router.refresh();
  };

  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back to InspectFlow."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-ink no-underline">
            Start free trial
          </Link>
        </>
      }
    >
      <AuthError>{serverError}</AuthError>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div className="mb-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link href="/forgot-password" className="text-[13px] font-medium text-ink-70 no-underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        <Button type="submit" variant="amber" className="w-full mt-4.5" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
