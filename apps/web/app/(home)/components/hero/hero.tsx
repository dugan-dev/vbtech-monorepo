import Image from "next/image";

import { LinkButton } from "@/components/link-button";

import { HERO_CONTENT } from "./hero-content";

export function Hero() {
  return (
    <section
      id={HERO_CONTENT.id}
      className="bg-gradient-to-br from-gray-100 to-white py-16"
      aria-label="Hero section"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 text-center md:text-left">
        <div className="md:w-2/3">
          <h1 className="text-5xl font-bold leading-tight w-fit">
            <span className="block">{HERO_CONTENT.title.line1}</span>
            <span className="block">{HERO_CONTENT.title.line2}</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {HERO_CONTENT.description}
          </p>

          <CTAGroup />
        </div>
        <HeroImage />
      </div>
    </section>
  );
}

function CTAGroup() {
  return (
    <div
      className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4"
      role="group"
      aria-label="Call to action buttons"
    >
      <LinkButton href={HERO_CONTENT.cta.primary.href}>
        {HERO_CONTENT.cta.primary.text}
      </LinkButton>

      <LinkButton href={HERO_CONTENT.cta.secondary.href} variant="outline">
        {HERO_CONTENT.cta.secondary.text}
      </LinkButton>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
      <Image
        {...HERO_CONTENT.image}
        className="rounded-lg shadow-lg"
        priority
      />
    </div>
  );
}
