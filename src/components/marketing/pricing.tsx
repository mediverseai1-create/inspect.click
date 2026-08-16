import { Reveal } from "./reveal";
import { ButtonLink } from "@/components/ui/button";
import { getPaymentLink } from "@/lib/payment-links";

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`flex-none w-4 h-4 mt-0.75 ${className}`}>
    <path d="M2 9l4 4 8-9" />
  </svg>
);

const plans = [
  {
    id: "free" as const,
    tier: "FREE",
    price: "$0",
    desc: "For a single site getting started.",
    features: ["1 location", "Up to 2 inspection templates", "Up to 3 inspector seats", "Photo evidence & manual checklist", "30-day inspection history"],
    cta: "Start for free",
    featured: false,
  },
  {
    id: "starter" as const,
    tier: "STARTER",
    price: "$47",
    desc: "For teams running recurring inspections across sites.",
    features: ["Up to 10 locations", "Unlimited templates & inspector seats", "Automatic issue creation on fail", "Corrective action assignment & tracking", "1-year inspection history"],
    cta: "Start free trial",
    featured: false,
  },
  {
    id: "pro" as const,
    tier: "PRO",
    price: "$57",
    desc: "For growing operations that want AI on their side.",
    features: ["Everything in Starter", "AI severity & action suggestions", "Recurring-problem detection across sites", "AI Inspection Assistant (ask-anything)", "3-year inspection history"],
    cta: "Start free trial",
    featured: true,
  },
  {
    id: "scale" as const,
    tier: "SCALE",
    price: "$97",
    desc: "For multi-site operations that need oversight.",
    features: ["Unlimited locations", "Everything in Pro", "Microsoft Entra ID SSO & SCIM provisioning", "Priority support", "Unlimited inspection history"],
    cta: "Start free trial",
    featured: false,
    badge: "FULL COVERAGE",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 max-md:py-16 bg-paper-dim">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal className="max-w-[640px] mb-14">
          <div className="mono inline-flex items-center gap-2.5 text-[12.5px] pl-3 border-l-[3px] border-amber text-ink-70">Pricing</div>
          <h2 className="text-[clamp(28px,3.6vw,40px)] leading-[1.12] mt-4.5">Straightforward plans, no seat games.</h2>
          <p className="mt-4 text-[17px] text-ink-70">Start free with one location. Move up when you need more sites, more oversight, or the AI Assistant.</p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:max-w-[440px] max-sm:mx-auto gap-5.5 items-stretch">
            {plans.map((p) => {
              const link = p.id === "free" ? "/sign-up" : getPaymentLink(p.id);
              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl p-8 max-lg:p-7 flex flex-col border ${
                    p.featured ? "bg-ink text-paper border-ink" : "bg-paper-card border-line"
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3.25 right-7 bg-amber text-ink font-mono text-[10.5px] tracking-wide px-3 py-1.5 rounded-full font-semibold">
                      {p.badge}
                    </div>
                  )}
                  <div className={`font-mono text-xs tracking-wide ${p.featured ? "text-paper/70" : "text-ink-55"}`}>{p.tier}</div>
                  <h3 className={`text-[38px] mt-3 font-serif ${p.featured ? "text-paper" : "text-ink"}`}>
                    {p.price}
                    {p.price !== "$0" && <span className={`font-sans text-sm font-medium ${p.featured ? "text-paper/50" : "text-ink-55"}`}> / month</span>}
                  </h3>
                  <p className={`mt-2 text-[14.5px] min-h-10 ${p.featured ? "text-paper/70" : "text-ink-70"}`}>{p.desc}</p>
                  <ul className="my-6.5 flex flex-col gap-3 flex-1 list-none p-0">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[14.5px]">
                        <CheckIcon className={p.featured ? "stroke-amber" : "stroke-pass"} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.id === "free" ? (
                    <ButtonLink href="/sign-up" variant={p.featured ? "amber" : "ghost"} className="w-full">
                      {p.cta}
                    </ButtonLink>
                  ) : link ? (
                    <ButtonLink href={link} variant={p.featured ? "amber" : "ghost"} className="w-full">
                      {p.cta}
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={`/sign-up?plan=${p.id}`} variant={p.featured ? "amber" : "ghost"} className="w-full">
                      {p.cta}
                    </ButtonLink>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8.5 flex flex-wrap justify-between gap-3.5 text-[13.5px] text-ink-55 border-t border-line pt-5.5">
            <span>All plans include photo evidence capture. Cancel anytime.</span>
            <span className="mono text-xs">SOC 2 TYPE II IN PROGRESS · MICROSOFT ENTRA ID SSO ON SCALE</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
