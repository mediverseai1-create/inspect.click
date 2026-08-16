"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, Badge } from "@/components/ui/card";
import { Textarea, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

interface InspectionItem {
  id: string;
  label: string;
  item_type: string;
  result: string | null;
  notes: string | null;
}

const RESULT_OPTIONS: { value: "pass" | "fail" | "na"; label: string }[] = [
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "na", label: "N/A" },
];

export function InspectionConductor({
  inspectionId,
  organizationId,
  locationId,
  status,
  userId,
  initialItems,
}: {
  inspectionId: string;
  organizationId: string;
  locationId: string | null;
  status: string;
  userId: string;
  initialItems: InspectionItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState<string | null>(null);
  const readOnly = status === "completed";

  const markStartedIfNeeded = async () => {
    if (status === "draft") {
      const supabase = createClient();
      await supabase.from("inspections").update({ status: "in_progress", started_at: new Date().toISOString() }).eq("id", inspectionId);
    }
  };

  const setResult = async (item: InspectionItem, result: "pass" | "fail" | "na") => {
    setSavingId(item.id);
    const supabase = createClient();
    await markStartedIfNeeded();
    await supabase.from("inspection_items").update({ result }).eq("id", item.id);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, result } : i)));

    if (result === "fail") {
      const { data: existing } = await supabase
        .from("findings")
        .select("id")
        .eq("inspection_item_id", item.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("findings").insert({
          organization_id: organizationId,
          inspection_id: inspectionId,
          inspection_item_id: item.id,
          location_id: locationId,
          title: item.label,
          description: item.notes || null,
          severity: "medium",
          status: "open",
          identified_by: userId,
        });
      }
    }
    setSavingId(null);
    router.refresh();
  };

  const saveNotes = async (item: InspectionItem, notes: string) => {
    const supabase = createClient();
    await markStartedIfNeeded();
    await supabase.from("inspection_items").update({ notes }).eq("id", item.id);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, notes } : i)));
  };

  const saveTextValue = async (item: InspectionItem, notes: string) => {
    await saveNotes(item, notes);
  };

  const complete = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("inspections")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", inspectionId);
      router.refresh();
    });
  };

  const allAnswered = items.every((i) => (i.item_type === "text" || i.item_type === "number" ? true : i.result));

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <Card className="p-6.5 text-[14.5px] text-ink-70">
          This inspection has no checklist items yet. Go back and attach a template, or add findings directly.
        </Card>
      )}

      {items.map((item, idx) => (
        <Card key={item.id} className="p-5.5">
          <div className="flex items-start justify-between gap-4 mb-3.5">
            <div className="flex items-start gap-3">
              <span className="font-mono text-[11px] text-ink-55 mt-1">{idx + 1}</span>
              <span className="text-[15px] font-medium">{item.label}</span>
            </div>
            {item.result === "fail" && <Badge tone="fail">FINDING CREATED</Badge>}
          </div>

          {(item.item_type === "pass_fail" || item.item_type === "pass_fail_na") && (
            <div className="flex gap-2 mb-3.5">
              {RESULT_OPTIONS.filter((o) => item.item_type === "pass_fail_na" || o.value !== "na").map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={readOnly || savingId === item.id}
                  onClick={() => setResult(item, opt.value)}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-semibold border-[1.5px] transition-colors disabled:opacity-50 ${
                    item.result === opt.value
                      ? opt.value === "pass"
                        ? "bg-pass text-white border-pass"
                        : opt.value === "fail"
                        ? "bg-fail text-white border-fail"
                        : "bg-ink text-paper border-ink"
                      : "bg-transparent border-line text-ink-70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {(item.item_type === "text" || item.item_type === "number") && (
            <Input
              type={item.item_type === "number" ? "number" : "text"}
              disabled={readOnly}
              defaultValue={item.notes ?? ""}
              placeholder={item.item_type === "number" ? "Enter reading" : "Enter note"}
              onBlur={(e) => saveTextValue(item, e.target.value)}
              className="mb-3.5"
            />
          )}

          {(item.item_type === "pass_fail" || item.item_type === "pass_fail_na") && (
            <Textarea
              disabled={readOnly}
              defaultValue={item.notes ?? ""}
              placeholder="Add a note (optional)"
              onBlur={(e) => saveNotes(item, e.target.value)}
              className="min-h-[70px] text-[13.5px]"
            />
          )}
        </Card>
      ))}

      {!readOnly && items.length > 0 && (
        <div className="flex items-center gap-4 mt-2">
          <Button type="button" variant="amber" onClick={complete} disabled={isPending || !allAnswered}>
            {isPending ? "Completing…" : "Complete inspection"}
          </Button>
          {!allAnswered && <span className="text-[13px] text-ink-55">Answer every checklist item to complete.</span>}
        </div>
      )}
    </div>
  );
}
