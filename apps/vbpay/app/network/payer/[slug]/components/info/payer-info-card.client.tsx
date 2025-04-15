"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";
import { PerfMonthLabels, PerformanceMonth } from "@/types/perf-month";

import { EditPayerFormData } from "./edit-payer-form/edit-payer-form-schema";
import { EditPayerSheet } from "./edit-payer-sheet";

type props = {
  data: EditPayerFormData;
  payerTypes: ComboItem[];
};

/**
 * Renders a card displaying payer details.
 *
 * This component displays detailed information about a payer, including its marketing name (with an optional reference name), payer type (mapped to a human-readable label), CMS ID, and the initial performance month. The card header conditionally includes an edit interface that is visible only when the user's attributes and roles meet the required access permissions.
 *
 * @param data - Contains the payer's details such as names, type, CMS ID, and performance month data.
 * @param payerTypes - Maps payer type values to their corresponding display labels.
 */
export function PayerInfoCardClient({ data, payerTypes }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Payer Information</CardTitle>
          <div className="relative ml-auto">
            <EditPayerSheet formData={data} payerTypes={payerTypes} />
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium text-end">
                {data.referenceName
                  ? `${data.marketingName} (${data.referenceName})`
                  : data.marketingName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-end">
                {data.payerType
                  ? PayerTypeLabels[data.payerType as PayerType]
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CMS ID:</span>
              <span className="font-medium text-end">
                {data.cmsId ? data.cmsId : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Initial Performance Month:
              </span>
              <span className="font-medium text-end">
                {`${PerfMonthLabels[data.initPerfMo as PerformanceMonth]} ${data.initPerfYr}`}
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
