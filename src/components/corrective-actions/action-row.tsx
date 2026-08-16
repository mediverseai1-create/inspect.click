"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const priorityTone: Record<string, "neutral" | "fail" | "pending"> = { low: "neutral", medium: "pending", high: "fail" };
const statusTone: Record<string, "neutral" | "pass" | "pending"> = { open: "pending", in_progress: "neutral", completed: "pass" };

export interface ActionRowData {
  id: string;
  title: string;
  priority: string;
  status: string;
  due_date: string | null;
  assignee_label: string | null;
  finding_title?: string;
}

export function ActionRow({ action, showFinding }: { action: ActionRowData; showFinding?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState(action.status);
  const [busy, setBusy] = useState(false);

  const toggleComplete = async () => {
    setBusy(true);
    const supabase = createClient();
    const next = status === "completed" ? "open" : "completed";
    await supabase
      .from("corrective_actions")
      .update({ status: next, completed_at: next === "completed" ? new Date().toISOString() : null })
      .eq("id", action.id);
    setStatus(next);
    setBusy(false);
    router.refresh();
  };

  const isOverdue = action.due_date && status !== "completed" && new Date(action.due_date) < new Date();

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-paper-dim last:border-b-0">
      <button
        onClick={toggleComplete}
        disabled={busy}
        aria-label={status === "completed" ? "Mark incomplete" : "Mark complete"}
        className={`w-5.5 h-5.5 rounded-full border-[1.5px] flex-none flex items-center justify-center bg-transparent cursor-pointer ${
          status === "completed" ? "bg-pass border-pass" : "border-line"
        }`}
      >
        {status === "completed" && (
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5" /></svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-[14.5px] font-medium ${status === "completed" ? "line-through text-ink-55" : ""}`}>{action.title}</div>
        <div className="text-[12px] text-ink-55 mt-0.5 flex gap-2 flex-wrap">
          {showFinding && action.finding_title && <span>{action.finding_title}</span>}
          {action.assignee_label && <span>{action.assignee_label}</span>}
          {action.due_date && <span className={isOverdue ? "text-fail font-medium" : undefined}>Due {formatDate(action.due_date)}</span>}
        </div>
      </div>
      <Badge tone={priorityTone[action.priority]}>{action.priority.toUpperCase()}</Badge>
      <Badge tone={statusTone[status]}>{status.replace("_", " ").toUpperCase()}</Badge>
    </div>
  );
}
