"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui/field";

export function FindingsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 mb-5 max-md:flex-col">
      <Select defaultValue={searchParams.get("status") ?? ""} onChange={(e) => setParam("status", e.target.value)} className="max-w-[190px] max-md:max-w-none">
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="in_review">In review</option>
        <option value="resolved">Resolved</option>
      </Select>
      <Select defaultValue={searchParams.get("severity") ?? ""} onChange={(e) => setParam("severity", e.target.value)} className="max-w-[190px] max-md:max-w-none">
        <option value="">All severities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </Select>
    </div>
  );
}
