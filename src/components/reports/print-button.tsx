"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" variant="ghost" className="px-4 py-2 text-[13px] print:hidden" onClick={() => window.print()}>
      Print / Export PDF
    </Button>
  );
}
