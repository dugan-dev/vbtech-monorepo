import { ORGANIZATION_INFO } from "@/values/organization";

import { Badge } from "@workspace/ui/components/badge";

export function Overview() {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About Our Organization
            </h2>
            {ORGANIZATION_INFO.description.map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              {ORGANIZATION_INFO.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="text-gray-600">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Key Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Organization Type:</span>
                <span className="font-medium">
                  {ORGANIZATION_INFO.keyInfo.organizationType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Function:</span>
                <span className="font-medium">
                  {ORGANIZATION_INFO.keyInfo.primaryFunction}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Regulatory Authority:</span>
                <span className="font-medium">
                  {ORGANIZATION_INFO.keyInfo.regulatoryAuthority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Review Type:</span>
                <span className="font-medium">
                  {ORGANIZATION_INFO.keyInfo.reviewType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
