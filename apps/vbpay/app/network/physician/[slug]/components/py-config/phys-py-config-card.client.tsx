"use client";

import { useLicenseContext } from "@/contexts/license-context";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { PaymentTypeType } from "@/types/payment-type";
import { Icons } from "@/components/icons";

import { PhysPyConfigDialog } from "./phys-py-config-dialog";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  perfYear: string;
  data: PhysPyConfigFormData;
  payerPubId: string;
  pubId: string;
};

/**
 * Displays a configuration card for physician payment types for a given performance year.
 *
 * Renders the enabled or disabled status of capitation, claim, and value-based payments based on license context and provided configuration data.
 *
 * @param perfYear - The performance year label to display.
 * @param data - Configuration data indicating which payment types are enabled.
 * @param payerPubId - The payer's public identifier.
 * @param pubId - The public identifier.
 */
export function PhysPyConfigCardClient({
  perfYear,
  data,
  payerPubId,
  pubId,
}: props) {
  const license = useLicenseContext();
  const paymentTypes = license.paymentTypes.split(",") as PaymentTypeType[];
  const hasCapitation = paymentTypes.includes("capitation");
  const hasClaim = paymentTypes.includes("ffs replacement");
  const hasValueBased = paymentTypes.includes("value based");
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.calendarCog className="size-6" />
          <CardTitle className="text-2xl">{`PY ${perfYear}`}</CardTitle>
          <div className="relative ml-auto">
            <PhysPyConfigDialog
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
            {hasCapitation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Capitation Payments:
                </span>
                <span className="font-medium text-end">
                  {data.enableCapPayments ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
            {hasClaim && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Claim Payments:</span>
                <span className="font-medium text-end">
                  {data.enableClaimPayments ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
            {hasValueBased && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Value Based Payments:
                </span>
                <span className="font-medium text-end">
                  {data.enableValuePayments ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
