import {
  MAILING_ADDRESS,
  SUBMISSION_METHODS,
  SUBMISSION_REQUIREMENTS,
} from "@/values/submission";

export function MedicalRecords() {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Medical Records Submission
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mailing Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-medium text-gray-900">
                {MAILING_ADDRESS.company}
              </p>
              <p className="text-gray-700">{MAILING_ADDRESS.attention}</p>
              <p className="text-gray-700">{MAILING_ADDRESS.poBox}</p>
              <p className="text-gray-700">{MAILING_ADDRESS.city}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  Required on envelope:
                </p>
                {MAILING_ADDRESS.requirements.map((requirement) => (
                  <p key={requirement} className="text-sm text-gray-600">
                    {requirement}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Electronic Submission
            </h3>
            <div className="space-y-4">
              {SUBMISSION_METHODS.map((method) => (
                <div
                  key={method.title}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <p className="font-medium text-gray-900 mb-2">
                    {method.title}
                  </p>
                  <p className="text-gray-700">{method.value}</p>
                  {method.note && (
                    <p className="text-sm text-gray-500 mt-1">{method.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            Submission Requirements
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {SUBMISSION_REQUIREMENTS.map((requirement) => (
              <li key={requirement}>• {requirement}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
