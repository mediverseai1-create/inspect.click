import { Reveal } from "./reveal";

const questions = ["Which unresolved findings are most urgent?", "What problems keep occurring?", "Summarize this week's inspections."];

const notes = [
  "Grounded only in your organization's own inspections, findings, and corrective actions — never invented.",
  "A person still reviews and confirms anything that changes a finding's status.",
  "Unavailable until you're signed in and an AI provider key is configured for your workspace.",
];

export function AiPanel() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <div className="grid grid-cols-[0.85fr_1.15fr] max-lg:grid-cols-1 gap-13 items-center">
          <Reveal>
            <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">
              Built AI-native
            </div>
            <h2 className="text-[clamp(26px,3.2vw,36px)] mt-4.5">Not a chatbot bolted onto a spreadsheet.</h2>
            <p className="mt-4 text-base text-ink-70">
              The AI Inspection Assistant is built into the system of record itself. Ask it directly from the dashboard, in plain language, and it answers from your organization&apos;s actual inspections, findings, and history.
            </p>
            <div className="flex flex-col gap-3 mt-7">
              {questions.map((q) => (
                <div key={q} className="flex gap-3 py-3.25 border-b border-line last:border-b-0 text-[15px]">
                  <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.6" strokeLinecap="round" className="flex-none w-4 h-4 mt-0.75 stroke-amber-deep">
                    <path d="M8 1v14M1 8h14" />
                  </svg>
                  &quot;{q}&quot;
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="bg-paper-card border border-line rounded-3xl shadow-[0_1px_0_rgba(23,24,29,0.04),0_12px_24px_-16px_rgba(23,24,29,0.18)] p-8">
              <h3 className="text-lg mb-4.5">How it stays honest</h3>
              <ul className="flex flex-col gap-4 list-none p-0 m-0">
                {notes.map((n) => (
                  <li key={n} className="flex gap-3 text-[14.5px] text-ink-70">
                    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none w-4 h-4 mt-0.75 stroke-pass">
                      <path d="M2 9l4 4 8-9" />
                    </svg>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
