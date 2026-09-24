import { Reveal } from "./reveal";

const panels = [
  {
    title: "Inspection status",
    desc: "Scheduled, in-progress, and completed inspections across every location — updated the moment an inspector marks an item.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="7" height="7" rx="1" /><rect x="14" y="4" width="7" height="7" rx="1" /><rect x="3" y="15" width="7" height="5" rx="1" /><path d="M14 17h7" />
      </svg>
    ),
  },
  {
    title: "Open & overdue actions",
    desc: "Every corrective action, its owner, and its deadline — with anything past due surfaced immediately.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h11M4 12h7M4 17h11" /><path d="M18 4l3 3-3 3" />
      </svg>
    ),
  },
  {
    title: "Recurring problems",
    desc: "When the same checklist item fails repeatedly at a location, the AI Assistant flags the pattern so it can be addressed at the root.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v10H9l-4 4V5z" /><path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

export function Spotlight() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal>
          <div className="bg-ink text-paper rounded-3xl p-14 max-md:p-8.5">
            <div className="grid grid-cols-[0.95fr_1.05fr] max-lg:grid-cols-1 gap-13 items-center">
              <div>
                <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-paper/70">
                  Command center
                </div>
                <h2 className="text-paper text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">Every site. Every finding. One screen of record.</h2>
                <p className="text-paper/70 mt-4 text-[17px]">
                  InspectFlow gives operations leaders a single, authoritative view of the whole inspection program — status, exposure, and what needs attention now, updated as your teams work in the field.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {panels.map((p) => (
                  <div key={p.title} className="bg-ink-soft border border-white/10 rounded-2xl px-5.5 py-5 flex gap-4">
                    <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center flex-none [&_svg]:w-5 [&_svg]:h-5 [&_svg]:stroke-amber">
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="text-paper text-[15px] mb-1">{p.title}</h4>
                      <p className="text-paper/60 text-[13.5px]">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
