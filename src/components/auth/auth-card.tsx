import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="p-8.5 max-md:p-6.5">
      <h1 className="text-[26px]">{title}</h1>
      {subtitle && <p className="mt-2 text-[14.5px] text-ink-70">{subtitle}</p>}
      <div className="mt-7">{children}</div>
      {footer && <div className="mt-6.5 pt-5.5 border-t border-line text-center text-[14.5px] text-ink-70">{footer}</div>}
    </Card>
  );
}

export function AuthError({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <div className="mb-5 rounded-[10px] border border-fail/30 bg-fail-bg px-4 py-3 text-[13.5px] text-fail">
      {children}
    </div>
  );
}

export function AuthNotice({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <div className="mb-5 rounded-[10px] border border-pass/30 bg-pass-bg px-4 py-3 text-[13.5px] text-pass">
      {children}
    </div>
  );
}
