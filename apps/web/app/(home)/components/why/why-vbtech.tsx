import { BenefitCard } from "./benefit-card";
import { WHY_CONTENT } from "./why-content";

export function WhyVBTech() {
  return (
    <section
      id={WHY_CONTENT.id}
      className="py-20 bg-gray-50"
      aria-labelledby="why-vbtech-title"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className="text-3xl font-semibold text-gray-900"
          id="why-vbtech-title"
        >
          {WHY_CONTENT.title}
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          {WHY_CONTENT.description}
        </p>

        <div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 md:mx-20"
          role="list"
        >
          {WHY_CONTENT.benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
