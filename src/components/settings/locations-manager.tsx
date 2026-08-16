"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Button, ButtonLink } from "@/components/ui/button";
import type { PlanId } from "@/lib/payment-links";

interface Location {
  id: string;
  name: string;
  address: string | null;
}

const PLAN_LOCATION_LIMITS: Record<PlanId, number | null> = {
  free: 1,
  starter: 10,
  pro: 10,
  scale: null,
};

export function LocationsManager({
  organizationId,
  initialLocations,
  plan,
}: {
  organizationId: string;
  initialLocations: Location[];
  plan: PlanId;
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const limit = PLAN_LOCATION_LIMITS[plan];
  const atLimit = limit !== null && locations.length >= limit;

  const addLocation = async () => {
    if (!name.trim() || atLimit) return;
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("locations")
      .insert({ organization_id: organizationId, name: name.trim() })
      .select("id, name, address")
      .single();
    setBusy(false);
    if (!error && data) {
      setLocations((prev) => [...prev, data]);
      setName("");
    }
  };

  const removeLocation = async (id: string) => {
    const supabase = createClient();
    await supabase.from("locations").delete().eq("id", id);
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <Card className="p-6.5">
      <h3 className="text-[17px] mb-4.5">Locations</h3>
      {locations.length === 0 && <p className="text-[13.5px] text-ink-55 mb-4">No locations yet.</p>}
      <div className="flex flex-col mb-4">
        {locations.map((l) => (
          <div key={l.id} className="flex items-center justify-between py-2.5 border-b border-paper-dim last:border-b-0">
            <span className="text-[14.5px]">{l.name}</span>
            <button onClick={() => removeLocation(l.id)} className="text-ink-55 bg-transparent border-none cursor-pointer p-1" aria-label="Remove location">
              <svg width="14" height="14" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
            </button>
          </div>
        ))}
      </div>
      {atLimit ? (
        <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-3 rounded-[10px] bg-paper-dim">
          <span className="text-[13px] text-ink-70">
            {plan === "free" ? "Free" : "Starter/Pro"} plan is limited to {limit} location{limit === 1 ? "" : "s"}.
          </span>
          <ButtonLink href="/dashboard/settings#plan" variant="ghost" className="px-4 py-1.5 text-[12.5px]">Upgrade</ButtonLink>
        </div>
      ) : (
        <div className="flex gap-2.5">
          <Input placeholder="e.g. Warehouse 4" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())} />
          <Button type="button" variant="ghost" className="px-4 py-2 text-[13px]" onClick={addLocation} disabled={busy || !name.trim()}>
            Add
          </Button>
        </div>
      )}
    </Card>
  );
}
