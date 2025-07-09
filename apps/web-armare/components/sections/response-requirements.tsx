import { RESPONSE_REQUIREMENTS } from "@/values/response";
import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const colorMap = {
  red: {
    border: "border-l-red-500",
    title: "text-red-700",
    content: "text-red-600",
  },
  orange: {
    border: "border-l-orange-500",
    title: "text-orange-700",
    content: "text-orange-600",
  },
  blue: {
    border: "border-l-blue-500",
    title: "text-blue-700",
    content: "text-blue-600",
  },
};

export function ResponseRequirements() {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Response Requirements
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {RESPONSE_REQUIREMENTS.map((requirement) => {
            const colors = colorMap[requirement.color];
            return (
              <Card
                key={requirement.title}
                className={`border-l-4 ${colors.border}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg ${colors.title}`}>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof requirement.content === "string" ? (
                    <>
                      <p
                        className={`text-2xl font-bold ${colors.content} mb-2`}
                      >
                        {requirement.content}
                      </p>
                      {requirement.title === "Response Deadline" && (
                        <p className="text-sm text-gray-600">
                          From date of request letter
                        </p>
                      )}
                    </>
                  ) : (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {requirement.content.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert className="mt-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Important</AlertTitle>
          <AlertDescription className="text-amber-700">
            Failure to respond within the specified timeframe may result in
            automatic recoupment of identified overpayments.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
