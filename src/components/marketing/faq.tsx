import { Reveal } from "./reveal";

const faqs = [
  {
    q: "How does InspectFlow use AI?",
    a: "AI analyzes your organization's inspection data to help classify findings, identify recurring problems, summarize inspection activity, and answer questions about your inspection history. Every response is grounded in your organization's actual data — it never invents inspection history or statistics.",
  },
  {
    q: "Does the AI make safety decisions for us?",
    a: "No. The AI can classify findings, suggest severity, and recommend corrective actions, but authorized people remain responsible for confirming inspection results and resolution. AI recommendations are recommendations, not autonomous safety decisions.",
  },
  {
    q: "Is the AI trained on our inspection data?",
    a: "No model is trained on your organization's data. The Assistant reads your current inspection records directly, in real time, to generate each answer — your data is never used to train shared models.",
  },
  {
    q: "Do inspectors need to install an app?",
    a: "No. Inspections open in the browser on any phone, tablet, or computer — nothing to install, nothing to update.",
  },
  {
    q: "What happens the moment an item fails?",
    a: "InspectFlow creates an issue automatically with the finding, evidence, location, and severity, and assigns it to the right person with a deadline.",
  },
  {
    q: "Can we bring our existing paper checklists?",
    a: "Yes. Recreate each checklist once as a template, then reuse it for every recurring inspection at that location.",
  },
  {
    q: "Is there a contract?",
    a: "No. Starter, Pro, and Scale are billed monthly, and you can cancel anytime — no long-term commitment.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">FAQ</div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">A few things people ask first.</h2>
        </Reveal>
        <Reveal className="max-w-[760px]">
          {faqs.map((f, i) => (
            <details key={f.q} className="border-b border-line group" open={i === 0}>
              <summary className="list-none cursor-pointer py-6 flex justify-between items-center gap-5 font-serif text-[19px] font-medium marker:content-['']">
                {f.q}
                <span className="flex-none w-6.5 h-6.5 rounded-full border-[1.5px] border-ink relative transition-transform group-open:rotate-180 before:content-[''] before:absolute before:w-2.75 before:h-px before:bg-ink before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-px after:h-2.75 after:bg-ink after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 group-open:after:opacity-0" />
              </summary>
              <div className="pb-6.5 max-w-[640px] text-[15.5px] text-ink-70">{f.a}</div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
