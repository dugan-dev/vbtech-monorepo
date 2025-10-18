import { HLTHBanner } from "@/components/hlth2025-banner";

import { CallToAction } from "./components/cta/call-to-action";
import { Hero } from "./components/hero/hero";
import { Partnering } from "./components/partnering/partnering";
import { Process } from "./components/process/process";
import { Services } from "./components/services/services";
import { Solutions } from "./components/solutions/solutions";
import { WhyVBTech } from "./components/why/why-vbtech";

export default function Page() {
  return (
    <div className="mt-20">
      <HLTHBanner />
      <Hero />

      <Services />

      <Partnering />

      <Solutions />

      <Process />

      <WhyVBTech />

      <CallToAction />
    </div>
  );
}
