"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inspectionSchema, type InspectionInput } from "@/lib/validations/inspection";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Select, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/auth-card";

interface Option {
  id: string;
  name?: string;
  label?: string;
}

export function NewInspectionForm({
  organizationId,
  templates,
  locations: initialLocations,
  members,
  defaultTemplateId,
}: {
  organizationId: string;
  templates: Option[];
  locations: Option[];
  members: Option[];
  defaultTemplateId?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [locations, setLocations] = useState(initialLocations);
  const [addingLocation, setAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InspectionInput>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: { title: "", templateId: defaultTemplateId ?? "", locationId: "", assignedTo: "", scheduledFor: "" },
  });

  const addLocation = async () => {
    if (!newLocationName.trim()) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("locations")
      .insert({ organization_id: organizationId, name: newLocationName.trim() })
      .select("id, name")
      .single();
    if (!error && data) {
      setLocations((prev) => [...prev, data]);
      setValue("locationId", data.id);
      setNewLocationName("");
      setAddingLocation(false);
    }
  };

  const onSubmit = async (data: InspectionInput) => {
    setServerError(null);
    const supabase = createClient();

    const { data: inspection, error } = await supabase
      .from("inspections")
      .insert({
        organization_id: organizationId,
        title: data.title,
        template_id: data.templateId || null,
        location_id: data.locationId || null,
        assigned_to: data.assignedTo || null,
        scheduled_for: data.scheduledFor || null,
        status: "draft",
      })
      .select("id")
      .single();

    if (error || !inspection) {
      setServerError(error?.message ?? "Couldn't create the inspection.");
      return;
    }

    if (data.templateId) {
      const { data: templateItems } = await supabase
        .from("template_items")
        .select("id, label, item_type, sort_order")
        .eq("template_id", data.templateId)
        .order("sort_order", { ascending: true });

      if (templateItems && templateItems.length > 0) {
        await supabase.from("inspection_items").insert(
          templateItems.map((item) => ({
            inspection_id: inspection.id,
            template_item_id: item.id,
            label: item.label,
            item_type: item.item_type,
            sort_order: item.sort_order,
          }))
        );
      }
    }

    router.push(`/dashboard/inspections/${inspection.id}`);
    router.refresh();
  };

  return (
    <Card className="p-6.5">
      <AuthError>{serverError}</AuthError>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4.5">
          <Label htmlFor="title">Inspection title</Label>
          <Input id="title" placeholder="Loading Dock — August Safety Check" {...register("title")} />
          <FieldError>{errors.title?.message}</FieldError>
        </div>

        <div className="mb-4.5">
          <Label htmlFor="templateId">Checklist template</Label>
          <Select id="templateId" {...register("templateId")}>
            <option value="">No template — build items manually later</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        </div>

        <div className="mb-4.5">
          <Label htmlFor="locationId">Location</Label>
          {!addingLocation ? (
            <div className="flex gap-2.5">
              <Select id="locationId" className="flex-1" {...register("locationId")}>
                <option value="">No location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </Select>
              <Button type="button" variant="ghost" className="px-4 py-2 text-[13px]" onClick={() => setAddingLocation(true)}>
                + New
              </Button>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <Input
                autoFocus
                placeholder="e.g. Warehouse 4"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
              />
              <Button type="button" variant="ghost" className="px-4 py-2 text-[13px]" onClick={addLocation}>
                Add
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6.5">
          <div>
            <Label htmlFor="assignedTo">Assign to</Label>
            <Select id="assignedTo" {...register("assignedTo")}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledFor">Scheduled date</Label>
            <Input id="scheduledFor" type="date" {...register("scheduledFor")} />
          </div>
        </div>

        <Button type="submit" variant="amber" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create inspection"}
        </Button>
      </form>
    </Card>
  );
}
