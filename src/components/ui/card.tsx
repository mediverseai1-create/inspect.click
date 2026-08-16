import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-paper-card border border-line rounded-2xl shadow-[0_1px_0_rgba(23,24,29,0.04),0_12px_24px_-16px_rgba(23,24,29,0.18)]",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "pass" | "fail" | "pending" | "amber";
  className?: string;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-dim text-ink-55",
    pass: "bg-pass-bg text-pass",
    fail: "bg-fail-bg text-fail",
    pending: "bg-amber/20 text-amber-deep",
    amber: "bg-amber text-ink",
  };
  return (
    <span
      className={cn(
        "font-mono text-[10.5px] tracking-wide px-2 py-1 rounded-md inline-flex items-center",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
