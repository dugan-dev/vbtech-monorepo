import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type props = {
  perfYear: string;
};

/**
 * Renders a card indicating that payer PY configuration is not supported for the specified type of payer.
 *
 * The component displays the provided performance year in the header along with an alert icon and a warning message.
 *
 * @param perfYear - The performance year to display in the card header.
 */
export function PayerPyConfigUnsupportedPayerType({ perfYear }: props) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Performance Year {perfYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 text-red-500" />
          <p className="text-sm text-red-500">
            Payer PY Config is not yet supported for this type of Payer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
