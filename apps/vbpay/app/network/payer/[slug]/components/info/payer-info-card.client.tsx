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
import { Icons } from "@/components/icons";

import { EditPayerFormData } from "./edit-payer-form/edit-payer-form-schema";
import { EditPayerSheet } from "./edit-payer-sheet";

type props = {
  data: EditPayerFormData;
  payerTypes: ComboItem[];
};

/**
 * Displays a card with detailed payer information and an edit interface.
 *
 * Shows the payer's marketing name (optionally with reference name), payer type label, CMS ID, and initial performance month and year. Includes an edit option for modifying payer details.
 *
 * @param data - The payer's details, including names, type, CMS ID, and performance month/year.
 * @param payerTypes - List of payer type options for mapping type values to display labels.
 */
export function PayerInfoCardClient({ data, payerTypes }: props) {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.heartPulse className="size-6" />
          <CardTitle className="text-2xl">{`${data.referenceName ? `${data.marketingName} (${data.referenceName}) ` : `${data.marketingName}`}`}</CardTitle>
          <div className="relative ml-auto">
            <EditPayerSheet formData={data} payerTypes={payerTypes} />
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="space-y-1 text-sm">
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
              <span className="text-muted-foreground">Initial Month/Year:</span>
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
