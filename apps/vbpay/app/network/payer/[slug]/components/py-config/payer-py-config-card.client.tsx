"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { stringToTitleCase } from "@workspace/ui/lib/stringToTitleCase";

import {
  AcoPaymentModelLabels,
  AcoPaymentModelType,
} from "@/types/aco-payment-model";
import { AcoProgramLabels, AcoProgramType } from "@/types/aco-program";
import { AcoTypeLabels, AcoTypeType } from "@/types/aco-type";

import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigSheet } from "./payer-py-config-sheet";

type props = {
  perfYear: string;
  data: PayerPyConfigFormData;
  payerPubId: string;
  pubId: string;
};

/**
 * Renders a card displaying payer configuration details for a performance year.
 *
 * The card header shows the performance year and conditionally renders a configuration sheet control for
 * authorized users based on provided user attributes. The scrollable content displays key configuration
 * details extracted from the data, including the program, type, payment model, and whether physician assignment
 * is enabled.
 */
export function PayerPyConfigCardClient({
  perfYear,
  data,
  payerPubId,
  pubId,
}: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Performance Year {perfYear}</CardTitle>
          <div className="relative ml-auto">
            <PayerPyConfigSheet
              data={data}
              pubId={pubId}
              payerPubId={payerPubId}
            />
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Program:</span>
              <span className="font-medium text-end">
                {data.basicInfo.program
                  ? AcoProgramLabels[data.basicInfo.program as AcoProgramType]
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-end">
                {data.basicInfo.type
                  ? AcoTypeLabels[data.basicInfo.type as AcoTypeType]
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Model:</span>
              <span className="font-medium text-end">
                {data.basicInfo.paymentModel
                  ? AcoPaymentModelLabels[
                      data.basicInfo.paymentModel as AcoPaymentModelType
                    ]
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Enable Physician Assignment:
              </span>
              <span className="font-medium text-end">
                {stringToTitleCase(data.physAssignment.isRequired.toString())}
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
