"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/auth-card";

export function NewReportForm({
  organizationId,
  inspections,
  defaultInspectionId,
}: {
  organizationId: string;
  inspections: { id: string; title: string }[];
  defaultInspectionId?: string;
}) {
  const router = useRouter();
  const [inspectionId, setInspectionId] = useState(defaultInspectionId ?? inspections[0]?.id ?? "");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const generate = async () => {
    if (!inspectionId) return;
    setSubmitting(true);
    setServerError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const inspection = inspections.find((i) => i.id === inspectionId);

    const { data, error } = await supabase
      .from("reports")
      .insert({
        organization_id: organizationId,
        inspection_id: inspectionId,
        title: `${inspection?.title ?? "Inspection"} — Report`,
        generated_by: user?.id,
      })
      .select("id")
      .single();

    setSubmitting(false);
    if (error || !data) {
      setServerError(error?.message ?? "Couldn't generate the report.");
      return;
    }

    router.push(`/dashboard/reports/${data.id}`);
  };

  if (inspections.length === 0) {
    return (
      <Card className="p-6.5">
        <p className="text-[14.5px] text-ink-70">
          No completed inspections yet. Reports are generated from inspections after they&apos;re completed.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6.5">
      <AuthError>{serverError}</AuthError>
      <Label htmlFor="inspection">Completed inspection</Label>
      <Select id="inspection" value={inspectionId} onChange={(e) => setInspectionId(e.target.value)} className="mb-6">
        {inspections.map((i) => (
          <option key={i.id} value={i.id}>{i.title}</option>
        ))}
      </Select>
      <Button type="button" variant="amber" onClick={generate} disabled={submitting}>
        {submitting ? "Generating…" : "Generate report"}
      </Button>
    </Card>
  );
}
