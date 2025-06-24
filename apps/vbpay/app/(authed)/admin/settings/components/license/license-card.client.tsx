"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ClientFormattedDate } from "@workspace/ui/components/common/client-formatted-date";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import {
  LicenseFunctionality,
  LicenseFunctionalityLabels,
} from "@/types/license-functionality";
import { LicenseType, LicenseTypeLabels } from "@/types/license-type";
import { PaymentTypeLabels, PaymentTypeType } from "@/types/payment-type";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { AdminSettingsSheet } from "../admin-settings-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

type props = {
  data: SetupFormData;
};

/**
 * Renders a card displaying detailed license information, with admin settings access restricted by user type and privileges.
 *
 * Shows license type, number of payers, validity dates, client and contact names, payment types, and any additional functionality. The admin settings sheet is only accessible to users of allowed types with admin rights.
 *
 * @param data - License and functionality details to display in the card.
 */
export function LicenseCardClient({ data }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>VBPay License</CardTitle>
          <RestrictByUserAppAttrsClient
            allowedUserTypes={ALLOWED_USER_TYPES}
            adminOnly
          >
            <AdminSettingsSheet data={data} from="license" />
          </RestrictByUserAppAttrsClient>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <dl className="grid grid-cols-2 gap-2">
            <dt className="font-semibold">Type:</dt>
            <dd>{LicenseTypeLabels[data.licenseInfo.type as LicenseType]}</dd>
            <dt className="font-semibold">Number of Payers:</dt>
            <dd>{data.licenseInfo.numPayers}</dd>
            <dt className="font-semibold">From Date:</dt>
            <dd>
              {data.licenseInfo.fromDate && (
                <ClientFormattedDate date={data.licenseInfo.fromDate} />
              )}
            </dd>
            <dt className="font-semibold">To Date:</dt>
            <dd>
              {data.licenseInfo.toDate && (
                <ClientFormattedDate date={data.licenseInfo.toDate} />
              )}
            </dd>
            <dt className="font-semibold">Client Name:</dt>
            <dd>{data.licenseInfo.clientName}</dd>
            <dt className="font-semibold">Contact:</dt>
            <dd>{data.licenseInfo.pocName}</dd>
            <dt className="font-semibold">Payment Types:</dt>
            <dd>
              {data.functionality.paymentTypes
                .map((type) => PaymentTypeLabels[type as PaymentTypeType])
                .join(", ")}
            </dd>
            {data.functionality.functionality.length > 0 && (
              <>
                <dt className="font-semibold">Additional Functionality:</dt>
                <dd>
                  {data.functionality.functionality
                    .map(
                      (type) =>
                        LicenseFunctionalityLabels[
                          type as LicenseFunctionality
                        ],
                    )
                    .join(", ")}
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
