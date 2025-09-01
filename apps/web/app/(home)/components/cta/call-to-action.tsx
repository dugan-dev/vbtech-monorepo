import { LinkButton } from "@/components/link-button";

import { CTA_CONTENT } from "./cta-content";

export function CallToAction() {
  return (
    <section
      id={CTA_CONTENT.id}
      className="py-24 bg-white text-center"
      aria-label={CTA_CONTENT.sectionAriaLabel}
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold">{CTA_CONTENT.title}</h2>
        <p className="mt-4 text-lg">{CTA_CONTENT.description}</p>
        <div className="mt-8">
          <LinkButton size="lg" href={CTA_CONTENT.button.href}>
            {CTA_CONTENT.button.text}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
