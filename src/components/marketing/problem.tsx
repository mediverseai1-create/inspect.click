import { Reveal } from "./reveal";

const before = [
  "Findings live in loose photos and paper checklists",
  "No one owns a failed item once it's written down",
  "Recurring problems go unnoticed across sites",
  '"Fixed" means someone said so, not proved it',
];

const after = [
  "Every finding is one record — evidence, location, history",
  "Failed items are assigned automatically, with a deadline",
  "The AI Assistant flags what keeps failing, and where",
  "A fix needs submitted evidence before it can be closed",
];

export function Problem() {
  return (
    <section className="py-24 max-md:py-16 bg-paper-dim">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">
            The gap InspectFlow closes
          </div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">The paper trail usually stops at the photo.</h2>
          <p className="mt-4 text-[17px] text-ink-70">
            A failed item gets flagged, a picture gets taken, and then it sits in a folder. InspectFlow keeps every finding moving until it&apos;s actually fixed.
          </p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 max-md:grid-cols-1 border border-line rounded-3xl overflow-hidden bg-paper-card">
            <div className="p-10 max-md:p-8">
              <h3 className="mono text-[13px] mb-5.5">Before InspectFlow</h3>
              <ul className="list-none p-0 m-0">
                {before.map((item) => (
                  <li key={item} className="flex gap-3 py-2.75 text-[15.5px] border-b border-paper-dim last:border-b-0 text-ink-55">
                    <svg viewBox="0 0 18 18" fill="none" stroke="#B14A29" strokeWidth="1.6" strokeLinecap="round" className="w-4.5 h-4.5 flex-none mt-0.5">
                      <path d="M4 4l10 10M14 4L4 14" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-10 max-md:p-8 border-l border-line max-md:border-l-0 max-md:border-t">
              <h3 className="mono text-[13px] mb-5.5 text-pass">With InspectFlow</h3>
              <ul className="list-none p-0 m-0">
                {after.map((item) => (
                  <li key={item} className="flex gap-3 py-2.75 text-[15.5px] border-b border-paper-dim last:border-b-0 text-ink font-medium">
                    <svg viewBox="0 0 18 18" fill="none" stroke="#2F6F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 flex-none mt-0.5">
                      <path d="M3 9l4 4 8-9" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
