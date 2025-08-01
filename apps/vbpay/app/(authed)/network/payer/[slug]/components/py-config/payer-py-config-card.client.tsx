"use client";

import { CalendarCog } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { stringToTitleCase } from "@workspace/utils/string-to-title-case";

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
 * Displays a card with payer configuration details for a specified performance year.
 *
 * The card shows the performance year, provides access to a configuration sheet, and lists key configuration details such as program, type, payment model, and physician assignment status.
 *
 * @param perfYear - The performance year to display.
 * @param data - The payer configuration data to render.
 * @param payerPubId - The public identifier for the payer.
 * @param pubId - The public identifier for the entity.
 */
export function PayerPyConfigCardClient({
  perfYear,
  data,
  payerPubId,
  pubId,
}: props) {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarCog className="size-6" />
          <CardTitle className="text-2xl">{`PY ${perfYear}`}</CardTitle>
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
                Physician Assignment:
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
