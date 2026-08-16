import { Reveal } from "./reveal";

const steps = [
  { n: "01", title: "Schedule the inspection", desc: "Set up a recurring or one-off inspection from a template and assign it to an inspector." },
  { n: "02", title: "Inspect, from any device", desc: "Work the checklist on a phone, tablet, or computer — mark pass, fail, or N/A, and attach evidence." },
  { n: "03", title: "Failed items become issues", desc: "InspectFlow creates the issue automatically, with severity, an owner, and a deadline attached." },
  { n: "04", title: "Verify before it closes", desc: "The responsible person submits evidence; a manager approves it, or sends it back for more work." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">How it works</div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">From scheduled inspection to verified fix.</h2>
          <p className="mt-4 text-[17px] text-ink-70">Four steps, and the loop only closes once the fix is proven.</p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-7">
            {steps.map((s) => (
              <div key={s.n} className="pt-2">
                <div className="font-serif text-[15px] text-amber-deep flex items-center gap-2.5 mb-4.5 before:content-[''] before:w-6.5 before:h-px before:bg-line">
                  {s.n}
                </div>
                <h4 className="text-lg mb-2.5">{s.title}</h4>
                <p className="text-[14.5px] text-ink-70">{s.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
