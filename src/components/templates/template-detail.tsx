"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { ItemType } from "@/types/database";

interface Item {
  id: string;
  label: string;
  item_type: string;
  sort_order: number;
}

const ITEM_TYPES = [
  { value: "pass_fail", label: "Pass / Fail" },
  { value: "pass_fail_na", label: "Pass / Fail / N/A" },
  { value: "text", label: "Text note" },
  { value: "number", label: "Number reading" },
];

export function TemplateDetail({ templateId, initialItems }: { templateId: string; initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("pass_fail");
  const [busy, setBusy] = useState(false);

  const addItem = async () => {
    if (!newLabel.trim()) return;
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("template_items")
      .insert({ template_id: templateId, label: newLabel.trim(), item_type: newType as ItemType, sort_order: items.length })
      .select("id, label, item_type, sort_order")
      .single();
    setBusy(false);
    if (!error && data) {
      setItems((prev) => [...prev, data]);
      setNewLabel("");
    }
  };

  const removeItem = async (id: string) => {
    const supabase = createClient();
    await supabase.from("template_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const deleteTemplate = async () => {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("inspection_templates").delete().eq("id", templateId);
    router.push("/dashboard/templates");
    router.refresh();
  };

  return (
    <Card className="p-6.5">
      <div className="flex items-center justify-between mb-4.5">
        <h3 className="text-[17px]">Checklist items ({items.length})</h3>
        <button onClick={deleteTemplate} className="text-[13px] font-semibold text-fail bg-transparent border-none cursor-pointer">
          Delete template
        </button>
      </div>

      <div className="flex flex-col gap-0">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-paper-dim">
            <span className="font-mono text-[11px] text-ink-55 w-5">{idx + 1}</span>
            <span className="flex-1 text-[14.5px]">{item.label}</span>
            <span className="font-mono text-[10.5px] px-2 py-1 rounded-md bg-paper-dim text-ink-55">
              {ITEM_TYPES.find((t) => t.value === item.item_type)?.label}
            </span>
            <button onClick={() => removeItem(item.id)} className="text-ink-55 bg-transparent border-none cursor-pointer p-1" aria-label="Remove">
              <svg width="14" height="14" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4.5 max-md:flex-col">
        <Input
          placeholder="Add another checklist item"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
        />
        <Select className="w-[190px] max-md:w-full" value={newType} onChange={(e) => setNewType(e.target.value)}>
          {ITEM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
        <Button type="button" variant="ghost" onClick={addItem} disabled={busy || !newLabel.trim()}>
          Add
        </Button>
      </div>
    </Card>
  );
}
