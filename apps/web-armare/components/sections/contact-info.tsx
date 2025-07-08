import { CONTACT_INFO } from "@/values/contact";
import { Mail } from "lucide-react";

export function ContactInfo() {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {CONTACT_INFO.map((contact) => (
            <div key={contact.department}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {contact.department}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.department === "Medical Records"
                        ? "Email"
                        : contact.department === "Appeals & Disputes"
                          ? "Appeals Email"
                          : "Email"}
                    </p>
                    <p className="text-gray-600">{contact.email}</p>
                    {contact.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {contact.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
