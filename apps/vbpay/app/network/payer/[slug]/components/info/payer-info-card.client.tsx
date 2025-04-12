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
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { EditPayerFormData } from "./edit-payer-form/edit-payer-form-schema";
import { EditPayerSheet } from "./edit-payer-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  data: EditPayerFormData;
  payerTypes: ComboItem[];
  usersAppAttrs: UserAppAttrs;
};

/**
 * Renders a card displaying payer details.
 *
 * This component presents the payer's information—including name, type, CMS ID, and initial performance month—in a card layout. An edit option is conditionally available via an embedded edit sheet when the user's attributes permit it. Placeholder values are used when certain data fields are absent.
 *
 * @param data - Contains the payer's details to be displayed.
 * @param payerTypes - Provides the list of payer types for mapping type values to labels.
 * @param usersAppAttrs - Defines user attributes that determine access to the edit functionality.
 */
export function PayerInfoCardClient({
  data,
  payerTypes,
  usersAppAttrs,
}: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Payer Information</CardTitle>
          <RestrictByUserAppAttrsClient
            usersAppAttrs={usersAppAttrs}
            allowedUserTypes={ALLOWED_USER_TYPES}
          >
            <div className="relative ml-auto">
              <EditPayerSheet formData={data} payerTypes={payerTypes} />
            </div>
          </RestrictByUserAppAttrsClient>
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
