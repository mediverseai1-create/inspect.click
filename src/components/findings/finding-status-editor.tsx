"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Select } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import type { Database } from "@/types/database";

type FindingUpdate = Database["public"]["Tables"]["findings"]["Update"];

export function FindingStatusEditor({
  findingId,
  severity,
  status,
}: {
  findingId: string;
  severity: string;
  status: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const update = async (field: "severity" | "status", value: string) => {
    setSaving(true);
    const supabase = createClient();
    const patch: FindingUpdate = { [field]: value };
    if (field === "status" && value === "resolved") patch.resolved_at = new Date().toISOString();
    await supabase.from("findings").update(patch).eq("id", findingId);
    setSaving(false);
    router.refresh();
  };

  return (
    <Card className="p-5.5">
      <h4 className="text-[14px] mb-3.5">Status</h4>
      <div className="flex flex-col gap-3.5">
        <div>
          <label className="block text-[12.5px] text-ink-55 mb-1.5">Severity</label>
          <Select defaultValue={severity} disabled={saving} onChange={(e) => update("severity", e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <div>
          <label className="block text-[12.5px] text-ink-55 mb-1.5">Status</label>
          <Select defaultValue={status} disabled={saving} onChange={(e) => update("status", e.target.value)}>
            <option value="open">Open</option>
            <option value="in_review">In review</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>
      </div>
    </Card>
  );
}
