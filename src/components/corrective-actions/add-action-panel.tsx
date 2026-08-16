"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ActionForm } from "./action-form";
import { ActionRow, type ActionRowData } from "./action-row";

export function AddActionPanel({
  organizationId,
  findingId,
  userId,
  members,
  initialActions,
}: {
  organizationId: string;
  findingId: string;
  userId: string;
  members: { id: string; label: string }[];
  initialActions: ActionRowData[];
}) {
  const [showForm, setShowForm] = useState(initialActions.length === 0);

  return (
    <Card className="p-5.5">
      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-[14px]">Corrective actions</h4>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-[13px] font-semibold text-ink bg-transparent border-none cursor-pointer">
            + Add
          </button>
        )}
      </div>

      {initialActions.length > 0 && (
        <div className="mb-4">
          {initialActions.map((a) => (
            <ActionRow key={a.id} action={a} />
          ))}
        </div>
      )}

      {showForm && (
        <ActionForm
          organizationId={organizationId}
          findingId={findingId}
          userId={userId}
          members={members}
          onCreated={() => setShowForm(false)}
        />
      )}
    </Card>
  );
}
