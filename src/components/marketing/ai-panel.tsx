import { Reveal } from "./reveal";

const questions = ["Which unresolved findings are most urgent?", "What problems keep occurring?", "Summarize this week's inspections."];

const trust = [
  "Grounded in your organization's own inspections, findings, and corrective actions — never invented.",
  "AI does not declare something safe. A person confirms every inspection result and status change.",
  "Recommendations are recommendations, not autonomous decisions — your team approves what happens next.",
];

export function AiPanel() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <div className="grid grid-cols-[0.85fr_1.15fr] max-lg:grid-cols-1 gap-13 items-start">
          <Reveal>
            <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">
              The intelligence layer
            </div>
            <h2 className="text-[clamp(26px,3.2vw,36px)] mt-4.5">Not a chatbot. An intelligence layer for your inspection program.</h2>
            <p className="mt-4 text-base text-ink-70">
              The AI Operations Assistant is built into the system of record itself — not a generic chatbot with your data pasted in. Ask it directly from the dashboard, in plain language, and it answers from your organization&apos;s actual inspections, findings, and history.
            </p>
            <div className="flex flex-col gap-3 mt-7 mb-8">
              {questions.map((q) => (
                <div key={q} className="flex gap-3 py-3.25 border-b border-line last:border-b-0 text-[15px]">
                  <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.6" strokeLinecap="round" className="flex-none w-4 h-4 mt-0.75 stroke-amber-deep">
                    <path d="M8 1v14M1 8h14" />
                  </svg>
                  &quot;{q}&quot;
                </div>
              ))}
            </div>
            <div className="mono text-[11.5px] text-ink-55 mb-3.5">How it stays honest</div>
            <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
              {trust.map((n) => (
                <li key={n} className="flex gap-3 text-[14px] text-ink-70">
                  <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-4 h-4 mt-0.75 stroke-pass">
                    <path d="M2 9l4 4 8-9" />
                  </svg>
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="bg-paper-card border border-line rounded-3xl shadow-[0_1px_0_rgba(23,24,29,0.04),0_12px_24px_-16px_rgba(23,24,29,0.18)] p-2">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-line">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-line" />
                  <span className="w-2 h-2 rounded-full bg-line" />
                  <span className="w-2 h-2 rounded-full bg-line" />
                </div>
                <span className="font-mono text-[11px] tracking-wide text-ink-55 ml-1">AI OPERATIONS ASSISTANT — ILLUSTRATIVE EXAMPLE</span>
              </div>
              <div className="px-4 pt-4.5 pb-5 flex flex-col gap-3.5">
                <div className="max-w-[88%] self-end bg-ink text-paper rounded-2xl rounded-br-[5px] px-4 py-3 text-[14.5px] leading-relaxed">
                  What problems keep occurring at our facilities?
                </div>
                <div className="max-w-[92%] self-start bg-paper-dim text-ink rounded-2xl rounded-bl-[5px] px-4 py-3 text-[14.5px] leading-relaxed">
                  Three checklist items have repeatedly failed at Facility A over the last six inspection cycles: dock-door sensors, fire-extinguisher pressure, and emergency lighting. Want me to open corrective actions for the recurring ones?
                </div>
                <div className="max-w-[88%] self-end bg-ink text-paper rounded-2xl rounded-br-[5px] px-4 py-3 text-[14.5px] leading-relaxed">
                  Which unresolved findings are most urgent?
                </div>
                <div className="max-w-[92%] self-start bg-paper-dim text-ink rounded-2xl rounded-bl-[5px] px-4 py-3 text-[14.5px] leading-relaxed">
                  2 high-severity findings are open and past their deadline, both at Warehouse 4. Everything else open is medium or low severity.
                </div>
              </div>
              <div className="px-4 pb-4 pt-1 text-[11.5px] text-ink-55 border-t border-line">
                Example conversation for illustration — every real answer is generated from your own workspace data.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
