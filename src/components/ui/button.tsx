import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "amber" | "ink" | "ghost" | "ghost-on-ink";

const variantClasses: Record<Variant, string> = {
  amber: "bg-amber text-ink hover:bg-[#FFC833]",
  ink: "bg-ink text-paper hover:bg-ink-soft",
  ghost: "bg-transparent border-ink text-ink hover:bg-ink hover:text-paper",
  "ghost-on-ink": "bg-transparent border-paper/70 text-paper hover:bg-paper hover:text-ink",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] px-6.5 py-3.5 border-[1.5px] border-transparent transition-transform duration-150 whitespace-nowrap hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "ink",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cn(base, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "ink",
  className,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Link href={href} className={cn(base, variantClasses[variant], className)} {...props}>
      {children}
    </Link>
  );
}
