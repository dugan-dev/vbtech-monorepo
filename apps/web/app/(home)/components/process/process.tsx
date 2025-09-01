import { ProcessStep } from "./process-step";
import { PROCESS_ID, PROCESS_STEPS } from "./process-steps";

export function Process() {
  return (
    <section id={PROCESS_ID} className="py-16 bg-[#F3F7FA]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Our Proven Process
        </h2>
        <p className="mt-2 text-gray-600 max-w-4xl mx-auto">
          A structured, step-by-step approach to transforming healthcare
          operations. We leverage industry expertise, technology, and best
          practices to enhance efficiency, ensure compliance, and optimize
          financial performance.
        </p>

        <div
          className="mt-10 flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8"
          role="list"
          aria-label="Process steps"
        >
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStep
              key={step.id}
              {...step}
              isLastStep={index === PROCESS_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
