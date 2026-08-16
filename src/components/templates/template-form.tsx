"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateSchema, type TemplateInput } from "@/lib/validations/template";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/auth-card";

const ITEM_TYPES = [
  { value: "pass_fail", label: "Pass / Fail" },
  { value: "pass_fail_na", label: "Pass / Fail / N/A" },
  { value: "text", label: "Text note" },
  { value: "number", label: "Number reading" },
];

export function TemplateForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: "", description: "", category: "", items: [{ label: "", item_type: "pass_fail" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: TemplateInput) => {
    setServerError(null);
    const supabase = createClient();

    const { data: template, error } = await supabase
      .from("inspection_templates")
      .insert({
        organization_id: organizationId,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
      })
      .select("id")
      .single();

    if (error || !template) {
      setServerError(error?.message ?? "Couldn't create the template.");
      return;
    }

    const { error: itemsError } = await supabase.from("template_items").insert(
      data.items.map((item, idx) => ({
        template_id: template.id,
        label: item.label,
        item_type: item.item_type,
        sort_order: idx,
      }))
    );

    if (itemsError) {
      setServerError(itemsError.message);
      return;
    }

    router.push(`/dashboard/templates/${template.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <AuthError>{serverError}</AuthError>

      <Card className="p-6.5 mb-5">
        <div className="mb-4.5">
          <Label htmlFor="name">Template name</Label>
          <Input id="name" placeholder="Loading Dock — Monthly Safety Check" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4.5">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Facilities, Fleet, Equipment…" {...register("category")} />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="What this checklist covers and when to run it." {...register("description")} />
        </div>
      </Card>

      <Card className="p-6.5 mb-5">
        <div className="flex items-center justify-between mb-4.5">
          <h3 className="text-[17px]">Checklist items</h3>
        </div>
        <FieldError>{errors.items?.message}</FieldError>
        <div className="flex flex-col gap-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-3 items-start max-md:flex-col">
              <div className="flex-1 w-full">
                <Input placeholder={`Checklist item ${idx + 1}`} {...register(`items.${idx}.label` as const)} />
                <FieldError>{errors.items?.[idx]?.label?.message}</FieldError>
              </div>
              <Select className="w-[190px] max-md:w-full" {...register(`items.${idx}.item_type` as const)}>
                {ITEM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                className="px-3 py-3 rounded-[10px] border border-line text-ink-55 bg-transparent disabled:opacity-40"
                aria-label="Remove item"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ label: "", item_type: "pass_fail" })}
          className="mt-4 text-[14px] font-semibold text-ink bg-transparent border-none cursor-pointer inline-flex items-center gap-1.5"
        >
          + Add checklist item
        </button>
      </Card>

      <Button type="submit" variant="amber" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save template"}
      </Button>
    </form>
  );
}
