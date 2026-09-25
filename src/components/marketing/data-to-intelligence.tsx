import { Reveal } from "./reveal";

const columns = [
  {
    label: "Inspection data",
    tone: "text-ink-55 border-line",
    items: ["Photos", "Checklists", "Findings", "Locations & assets", "Corrective actions", "Inspection history"],
  },
  {
    label: "AI analysis",
    tone: "text-amber-deep border-amber",
    items: ["Classifies", "Detects patterns", "Identifies recurring problems", "Surfaces priorities", "Summarizes activity", "Answers questions"],
  },
  {
    label: "Operational action",
    tone: "text-pass border-pass",
    items: ["Assign", "Fix", "Verify", "Prioritize", "Prevent recurrence"],
  },
];

function Arrow() {
  return (
    <svg className="w-7 h-7 flex-none stroke-ink-55 mx-auto max-lg:rotate-90" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function DataToIntelligence() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">
            From data to intelligence
          </div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">Turn every inspection into intelligence.</h2>
          <p className="mt-4 text-[17px] text-ink-70">
            Every inspection adds structured operational data to your organization&apos;s history. InspectFlow&apos;s AI helps turn that growing dataset into useful answers, patterns, and recommendations.
          </p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] max-lg:grid-cols-1 gap-6 max-lg:gap-3 items-center">
            {columns.map((col, idx) => (
              <div key={col.label} className="contents max-lg:block">
                <div className="bg-paper-card border-[1.5px] border-line rounded-2xl p-7">
                  <div className={`mono text-[11.5px] mb-4 pb-3 border-b ${col.tone}`}>{col.label.toUpperCase()}</div>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {col.items.map((item) => (
                      <li key={item} className="text-[14.5px] text-ink-70">{item}</li>
                    ))}
                  </ul>
                </div>
                {idx < columns.length - 1 && <Arrow />}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
