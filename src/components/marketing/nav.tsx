"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "#product", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-paper/88 backdrop-blur-md border-b border-line">
      <div className="flex items-center justify-between px-8 py-4 max-w-[1180px] mx-auto max-md:px-5">
        <Logo />
        <div className="hidden md:flex items-center gap-8.5">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[14.5px] font-medium text-ink-70 hover:text-ink no-underline transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4.5">
          <Link href="/sign-in" className="text-[14.5px] font-semibold text-ink no-underline">
            Log in
          </Link>
          <ButtonLink href="/sign-up" variant="ink" className="px-5.5 py-2.5 text-sm">
            Start free trial
          </ButtonLink>
        </div>
        <button
          className="md:hidden p-1.5 bg-transparent border-none"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#17181D" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-0.5 px-8 pb-5.5 pt-1.5 border-t border-line">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3.5 text-[15.5px] font-medium text-ink no-underline border-b border-line"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 mt-3.5">
            <Link href="/sign-in" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] px-6 py-3.5 border-[1.5px] border-ink text-ink no-underline">
              Log in
            </Link>
            <Link href="/sign-up" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] px-6 py-3.5 bg-ink text-paper no-underline">
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
