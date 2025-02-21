import { ServiceCard } from "./services-card";
import { SERVICES_CONTENT } from "./services-content";

export function Services() {
  return (
    <section className="py-16" aria-labelledby="services-title">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          {SERVICES_CONTENT.title}
        </h2>
        <p className="mt-2 text-gray-600 max-w-4xl mx-auto">
          {SERVICES_CONTENT.description}
        </p>

        <div
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8"
          role="list"
        >
          {SERVICES_CONTENT.services.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
