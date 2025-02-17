import { CtaSection } from "@/components/cta-section";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import HLTH2024Banner from "@/components/hlth2024-banner";

export default function Page() {
  const today = new Date();
  // HLTH2024 runs from October 20-23 but we show the banner from October 15th to October 31st
  const isHlth2024 =
    today.getMonth() === 9 && today.getDate() >= 15 && today.getDate() <= 31;
  return (
    <div className="flex flex-col items-center flex-1">
      <Header />
      {isHlth2024 && <HLTH2024Banner />}
      <Hero />
      <Features />
      <CtaSection />
      <Footer />
    </div>
  );
}
