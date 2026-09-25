import { Reveal } from "./reveal";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <Reveal>
          <div className="bg-ink text-paper rounded-3xl px-15 py-18 max-md:px-7 max-md:py-13 text-center">
            <h2 className="text-paper text-[clamp(30px,4.6vw,46px)] max-w-[640px] mx-auto">Put your inspection program on an AI-native system of record.</h2>
            <p className="mt-4.5 text-paper/70 text-[17px] max-w-[520px] mx-auto">Capture every inspection, turn findings into corrective actions, and let AI surface the patterns your team needs to see.</p>
            <div className="flex items-center gap-6.5 mt-8.5 flex-wrap justify-center">
              <ButtonLink href="/sign-up" variant="amber">Start free trial</ButtonLink>
              <ButtonLink href="#pricing" variant="ghost-on-ink">Talk to sales</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
