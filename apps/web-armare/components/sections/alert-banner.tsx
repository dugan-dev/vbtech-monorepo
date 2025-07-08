import { AlertCircle } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";

export function AlertBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-200 py-3">
      <div className="container mx-auto px-6">
        <Alert className="border-blue-200 bg-transparent">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Important Notice</AlertTitle>
          <AlertDescription className="text-blue-700">
            If you have received correspondence from Armare Claim Review
            regarding Medicare claim reviews, please review the information
            below for response procedures and requirements.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
