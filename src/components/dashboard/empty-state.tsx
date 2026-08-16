import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Card className="px-8 py-14 text-center">
      <h3 className="text-lg">{title}</h3>
      {description && <p className="mt-2 text-[14.5px] text-ink-70 max-w-[420px] mx-auto">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  );
}
