"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import {
  LicenseFunctionality,
  LicenseFunctionalityLabels,
} from "@/types/license-functionality";
import { LicenseType, LicenseTypeLabels } from "@/types/license-type";
import { PaymentTypeLabels, PaymentTypeType } from "@/types/payment-type";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import { ClientFormattedDate } from "@/components/client-formatted-date";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { AdminSettingsSheet } from "../admin-settings-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

type props = {
  data: SetupFormData;
  usersAppAttrs: UserAppAttrs;
};

/**
 * Renders a card displaying VBPay license information with restricted administrative settings.
 *
 * This component presents key license details such as type, number of payers, effective dates,
 * client information, and payment types. Additional functionality is displayed if available.
 * Access to the administrative settings is controlled based on user attributes.
 *
 * @param data - Contains the license details and functionality configuration for display.
 * @param usersAppAttrs - Holds the current user's attributes used to determine access to admin settings.
 */
export function LicenseCardClient({ data, usersAppAttrs }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>VBPay License</CardTitle>
          <RestrictByUserAppAttrsClient
            usersAppAttrs={usersAppAttrs}
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
