"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { correctiveActionSchema, type CorrectiveActionInput } from "@/lib/validations/finding";
import { createClient } from "@/lib/supabase/client";
import { Input, Select, Textarea, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/auth-card";

export function ActionForm({
  organizationId,
  findingId,
  userId,
  members,
  onCreated,
}: {
  organizationId: string;
  findingId: string;
  userId: string;
  members: { id: string; label: string }[];
  onCreated: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CorrectiveActionInput>({
    resolver: zodResolver(correctiveActionSchema),
    defaultValues: { title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" },
  });

  const onSubmit = async (data: CorrectiveActionInput) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.from("corrective_actions").insert({
      organization_id: organizationId,
      finding_id: findingId,
      title: data.title,
      description: data.description || null,
      assigned_to: data.assignedTo || null,
      priority: data.priority,
      due_date: data.dueDate || null,
      created_by: userId,
      status: "open",
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    reset();
    onCreated();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
      <AuthError>{serverError}</AuthError>
      <div>
        <Label htmlFor="action-title">What needs to be done</Label>
        <Input id="action-title" placeholder="Replace dock door sensor" {...register("title")} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="action-description">Details (optional)</Label>
        <Textarea id="action-description" {...register("description")} />
      </div>
      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        <div>
          <Label htmlFor="action-assignee">Assign to</Label>
          <Select id="action-assignee" {...register("assignedTo")}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="action-priority">Priority</Label>
          <Select id="action-priority" {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="action-due">Due date</Label>
          <Input id="action-due" type="date" {...register("dueDate")} />
        </div>
      </div>
      <Button type="submit" variant="ghost" disabled={isSubmitting} className="self-start px-5 py-2.5 text-sm">
        {isSubmitting ? "Adding…" : "Add corrective action"}
      </Button>
    </form>
  );
}
