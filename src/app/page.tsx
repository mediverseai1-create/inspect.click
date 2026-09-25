import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Problem } from "@/components/marketing/problem";
import { ProductTour } from "@/components/marketing/product-tour";
import { AiIntelligence } from "@/components/marketing/ai-intelligence";
import { Spotlight } from "@/components/marketing/spotlight";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { LoopDiagram } from "@/components/marketing/loop-diagram";
import { DataToIntelligence } from "@/components/marketing/data-to-intelligence";
import { AiPanel } from "@/components/marketing/ai-panel";
import { Industries } from "@/components/marketing/industries";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Problem />
        <ProductTour />
        <AiIntelligence />
        <Spotlight />
        <HowItWorks />
        <LoopDiagram />
        <DataToIntelligence />
        <AiPanel />
        <Industries />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
