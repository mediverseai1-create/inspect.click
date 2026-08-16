import Link from "next/link";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#17181D" />
      <path
        d="M9 21 L17 28 L31 11"
        stroke="#F6F2E9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="31" cy="11" r="3.4" fill="#F5B400" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-ink no-underline" aria-label="InspectFlow home">
      <LogoMark />
      <span className="font-serif font-semibold text-[19px] tracking-tight">InspectFlow</span>
    </Link>
  );
}
