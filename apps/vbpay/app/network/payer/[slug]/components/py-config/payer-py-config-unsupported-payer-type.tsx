import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Icons } from "@/components/icons";

type props = {
  perfYear: string;
};

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
          <Icons.alertCircle className="h-10 w-10 text-muted-foreground mb-2 text-red-500" />
          <p className="text-sm text-red-500">
            Payer PY Config is not yet supported for this type of Payer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
