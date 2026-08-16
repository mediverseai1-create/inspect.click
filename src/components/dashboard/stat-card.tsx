"use client";

import { useEffect, useRef, useState } from "react";

export function StatCard({ value, label, dark = false }: { value: number; label: string; dark?: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setDisplay(value), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dur = 1100;
            const start = performance.now();
            const step = (now: number) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className={
        dark
          ? "bg-ink-soft border border-white/10 rounded-2xl px-5 py-4.5"
          : "bg-paper-card border border-line rounded-2xl px-5 py-4.5"
      }
    >
      <div className={`font-serif text-[30px] ${dark ? "text-paper" : "text-ink"}`}>{display}</div>
      <div className={`mt-1 text-[12.5px] ${dark ? "text-paper/50" : "text-ink-55"}`}>{label}</div>
    </div>
  );
}
