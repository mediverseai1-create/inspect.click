import { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
      <div>
        <h1 className="text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14.5px] text-ink-70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
