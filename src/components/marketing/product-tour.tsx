import { ReactNode } from "react";
import { Reveal } from "./reveal";

const features: { title: string; desc: string; ai?: boolean; icon: ReactNode }[] = [
  {
    title: "Overview Dashboard",
    desc: "See your inspection program at a glance — with AI surfacing overdue work, recurring failures, and the findings that deserve attention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="7" height="7" rx="1" /><rect x="14" y="4" width="7" height="7" rx="1" /><rect x="3" y="15" width="7" height="5" rx="1" /><path d="M14 17h7" />
      </svg>
    ),
  },
  {
    title: "Inspection Templates",
    desc: "Standardize every inspection so your organization builds a consistent, structured source of data — the foundation AI needs to analyze it well.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4M9 12h6M9 16h6M9 8h2" />
      </svg>
    ),
  },
  {
    title: "Inspection Schedule",
    desc: "Plan recurring and one-off inspections. Every cycle adds to the history AI draws on to spot patterns over time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><circle cx="8" cy="15" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Conduct Inspection",
    desc: "Work the checklist from a phone or tablet. Every pass, fail, photo, and note becomes structured data the platform can act on.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    title: "Findings & Issues",
    desc: "AI helps classify findings and suggest severity, turning failed checks into tracked issues with evidence, an owner, and a deadline.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Corrective Actions",
    desc: "AI can recommend a next step from the finding, while your team stays in control of what gets approved, assigned, and resolved.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h11M4 12h7M4 17h11" /><path d="M18 4l2.5 2.5L18 9" />
      </svg>
    ),
  },
  {
    title: "Locations & Assets",
    desc: "Build a history of inspection activity across every facility, vehicle, and asset — the foundation AI uses to detect patterns.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" />
      </svg>
    ),
  },
  {
    title: "AI Inspection Assistant",
    desc: "Ask what's overdue, what's recurring, or what to prioritize this week — in plain language.",
    ai: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v10H9l-4 4V5z" /><path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    title: "Reports & History",
    desc: "More than an export — your inspection history is the intelligence layer AI analyzes to answer questions and surface trends.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l4 4v14H6z" /><path d="M9 12h6M9 15h6M9 9h2" />
      </svg>
    ),
  },
];

export function ProductTour() {
  return (
    <section id="product" className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">The platform</div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">One platform, the entire inspection lifecycle.</h2>
          <p className="mt-4 text-[17px] text-ink-70">One system of record for inspections — with AI built into the workflow so your inspection data becomes operational intelligence, not just historical records.</p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-line border border-line rounded-3xl overflow-hidden">
            {features.map((f) => (
              <div key={f.title} className="bg-paper-card hover:bg-white p-7.5 transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10.5 h-10.5 rounded-[11px] bg-paper-dim flex items-center justify-center [&_svg]:w-5.25 [&_svg]:h-5.25 [&_svg]:stroke-ink">
                    {f.icon}
                  </div>
                  {f.ai && (
                    <span className="font-mono text-[10px] tracking-wide px-2 py-1 rounded-md bg-amber text-ink font-semibold">AI</span>
                  )}
                </div>
                <h4 className="text-[17px] mb-2">{f.title}</h4>
                <p className="text-[14.5px] text-ink-70">{f.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
