import { Reveal } from "./reveal";

const pills = ["Item fails", "Issue created", "Assigned", "Evidence submitted", "Verified & closed"];

function Arrow() {
  return (
    <svg className="w-8.5 h-3.5 flex-none stroke-ink-55 mx-1.5 max-md:rotate-90 max-md:my-1.5" viewBox="0 0 34 14" fill="none">
      <path d="M0 7h30M24 2l6 5-6 5" strokeWidth="1.6" />
    </svg>
  );
}

export function LoopDiagram() {
  return (
    <section className="pb-24 max-md:pb-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal>
          <div className="bg-paper-card border border-line rounded-3xl px-9 py-11 max-md:px-6 max-md:py-8">
            <div className="flex items-center flex-wrap justify-center max-md:flex-col">
              {pills.map((p, i) => (
                <span key={p} className="contents">
                  <span
                    className="font-mono text-xs tracking-wide px-4.5 py-2.75 rounded-full border-[1.5px] bg-paper whitespace-nowrap"
                    style={{
                      borderColor: i === 0 ? "#B14A29" : i === pills.length - 1 ? "#2F6F4E" : "var(--ink)",
                    }}
                  >
                    {p}
                  </span>
                  {i < pills.length - 1 && <Arrow />}
                </span>
              ))}
            </div>
            <p className="mt-6.5 text-center text-sm text-ink-55">
              Every closed issue feeds the next inspection cycle — recurring problems surface automatically instead of repeating quietly.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
