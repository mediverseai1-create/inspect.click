"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Select } from "@/components/ui/field";

export function InspectionsFilterBar() {
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
      <Input
        placeholder="Search inspections…"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="max-w-[280px] max-md:max-w-none"
      />
      <Select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="max-w-[190px] max-md:max-w-none"
      >
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </Select>
      <Select
        defaultValue={searchParams.get("sort") ?? ""}
        onChange={(e) => setParam("sort", e.target.value)}
        className="max-w-[190px] max-md:max-w-none"
      >
        <option value="">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title A–Z</option>
      </Select>
    </div>
  );
}
