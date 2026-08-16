import { ButtonLink } from "@/components/ui/button";

const steps = [
  { label: "Item fails", tone: "border-fail text-fail" },
  { label: "Issue created", tone: "border-ink text-ink" },
  { label: "Assigned & fixed", tone: "border-ink text-ink" },
  { label: "Verified & closed", tone: "border-pass text-pass" },
];

export function Hero() {
  return (
    <header className="pt-19 pb-22.5 overflow-hidden">
      <div className="grid grid-cols-[1.05fr_0.95fr] gap-14 items-center max-w-[1180px] mx-auto px-8 max-lg:grid-cols-1 max-lg:gap-13 max-md:px-5">
        <div>
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70 mb-5.5">
            AI inspection &amp; corrective action
          </div>
          <h1 className="text-[clamp(38px,5.6vw,60px)] leading-[1.04] font-medium">
            Inspections that end in
            <br />
            <span className="bg-amber px-2.5 pb-1 box-decoration-clone">a resolved issue, not a forgotten photo</span>
          </h1>
          <p className="mt-6.5 max-w-[490px] text-lg leading-relaxed text-ink-70">
            Every failed check becomes a tracked issue — evidenced, assigned, and verified before it&apos;s closed. Nothing waits in a spreadsheet again.
          </p>
          <div className="flex items-center gap-6.5 mt-8.5 flex-wrap">
            <ButtonLink href="/sign-up" variant="amber">
              Start free trial
            </ButtonLink>
            <a href="#how" className="inline-flex items-center gap-1.5 font-semibold text-[15px] no-underline text-ink border-b-[1.5px] border-ink pb-0.5">
              See how it works
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#17181D" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
          <div className="mt-11.5 flex flex-wrap gap-2.5 items-center">
            {["FACILITIES", "FLEETS", "WAREHOUSES", "PRODUCTION FLOORS", "JOB SITES"].map((c) => (
              <span key={c} className="font-mono text-[11.5px] tracking-wide px-3 py-1.75 rounded-full border border-line text-ink-55 bg-paper-card">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-paper-card border border-line rounded-3xl shadow-[0_1px_0_rgba(23,24,29,0.04),0_12px_24px_-16px_rgba(23,24,29,0.18)] p-9 max-md:p-7">
          <div className="mono text-[11.5px] text-ink-55 mb-6">HOW A FINDING MOVES</div>
          <div className="flex flex-col gap-0">
            {steps.map((s, idx) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className={`w-3 h-3 rounded-full border-2 flex-none ${s.tone}`} style={{ background: idx === steps.length - 1 ? "currentColor" : "transparent" }} />
                  {idx < steps.length - 1 && <span className="w-px h-11 bg-line" />}
                </div>
                <span className={`text-[15px] font-medium pb-9 ${idx === steps.length - 1 ? "pb-0" : ""} ${s.tone.split(" ")[1]}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 pt-5 border-t border-line text-[13.5px] text-ink-55">
            No step can be skipped — a fix needs submitted evidence before InspectFlow lets it close.
          </p>
        </div>
      </div>
    </header>
  );
}
