import { APPEAL_STEPS } from "@/values/appeal";

export function AppealsProcess() {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Appeals Process
        </h2>

        <div className="space-y-6">
          {APPEAL_STEPS.map((step) => (
            <div key={step.step} className="flex items-start space-x-4">
              <div
                className="bg-blue-100 rounded-full p-2 mt-1"
                aria-hidden="true"
              >
                <span className="text-blue-600 font-bold text-sm">
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
