import { Reveal } from "./reveal";

const capabilities = [
  {
    title: "AI Finding Analysis",
    desc: "Analyzes inspection findings to help classify issues, identify severity, and surface what requires attention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "AI Pattern Detection",
    desc: "Identifies recurring failures across inspections and locations, so problems that would otherwise repeat unnoticed get caught.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="17" r="2" /><path d="M6 9v2a2 2 0 0 0 2 2h2M18 9v2a2 2 0 0 1-2 2h-2" />
      </svg>
    ),
  },
  {
    title: "AI Corrective-Action Recommendations",
    desc: "Generates a recommended next step from the finding, while final approval and resolution stay with your team.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h11M4 12h7M4 17h11" /><path d="M18 4l2.5 2.5L18 9" />
      </svg>
    ),
  },
  {
    title: "AI Inspection Summaries",
    desc: "Turns inspection activity into concise summaries, so operations leaders understand what happened without reviewing every inspection.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l4 4v14H6z" /><path d="M9 12h6M9 15h6M9 9h2" />
      </svg>
    ),
  },
  {
    title: "AI Operations Assistant",
    desc: "Answers questions about your organization's inspections, findings, corrective actions, and history in plain language.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v10H9l-4 4V5z" /><path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

export function AiIntelligence() {
  return (
    <section className="py-24 max-md:py-16 bg-paper-dim">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">
            AI inspection intelligence
          </div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">Your inspection data should tell you more than what failed.</h2>
          <p className="mt-4 text-[17px] text-ink-70">
            InspectFlow uses AI to turn inspection history into actionable operational intelligence — helping teams identify recurring failures, prioritize findings, understand what&apos;s happening across locations, and decide what deserves attention.
          </p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
            {capabilities.map((c) => (
              <div key={c.title} className="bg-paper-card border border-line rounded-2xl p-7">
                <div className="w-10.5 h-10.5 rounded-[11px] bg-amber/15 flex items-center justify-center mb-5 [&_svg]:w-5.25 [&_svg]:h-5.25 [&_svg]:stroke-amber-deep">
                  {c.icon}
                </div>
                <h4 className="text-[16.5px] mb-2">{c.title}</h4>
                <p className="text-[14px] text-ink-70">{c.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
