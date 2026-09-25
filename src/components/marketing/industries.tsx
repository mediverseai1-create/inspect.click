import { Reveal } from "./reveal";

const industries = [
  "Facilities",
  "Fleets & vehicles",
  "Warehouses",
  "Production floors",
  "Construction sites",
  "Healthcare facilities",
  "Retail properties",
  "Equipment & machinery",
];

export function Industries() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="mb-8">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">Built for real-world operations</div>
          <h2 className="text-[28px] mt-4.5">AI inspection intelligence for teams managing inspections across physical operations.</h2>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {industries.map((i) => (
              <span key={i} className="px-5 py-3 rounded-full border border-line bg-paper-card text-[14.5px] font-medium">
                {i}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
