"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import {
  NetworkPhysicianClassLabels,
  NetworkPhysicianClassType,
} from "@/types/network-physician-class";
import {
  NetworkPhysicianType,
  NetworkPhysicianTypeLabels,
} from "@/types/network-physician-type";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { EditPhysicianFormData } from "./edit-physician-form/edit-physician-form-schema";
import { EditPhysicianSheet } from "./edit-physician-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLES: UserRole[] = ["edit"];

type props = {
  data: EditPhysicianFormData;
  payerPubId: string;
  usersAppAttrs: UserAppAttrs;
};

/**
 * Displays detailed physician information in a card with optional editing for authorized users.
 *
 * Shows the physician's full name, individual NPI, type, and class. An edit interface is available in the card header for users with the appropriate access attributes and roles.
 *
 * @param data - Physician details including first name, last name, NPI, type, and class.
 * @param usersAppAttrs - User attributes used to determine edit access.
 * @param payerPubId - Identifier for the associated payer.
 */
export function PhysicianInfoCardClient({
  data,
  usersAppAttrs,
  payerPubId,
}: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Physician Information</CardTitle>
          <RestrictByUserAppAttrsClient
            usersAppAttrs={usersAppAttrs}
            allowedUserTypes={ALLOWED_USER_TYPES}
            requiredUserRoles={REQUIRED_USER_ROLES}
          >
            <div className="relative ml-auto">
              <EditPhysicianSheet formData={data} payerPubId={payerPubId} />
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
                {`${data.firstName} ${data.lastName}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Individual NPI:</span>
              <span className="font-medium text-end">{data.npi}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-end">
                {NetworkPhysicianTypeLabels[data.type as NetworkPhysicianType]}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-medium text-end">
                {
                  NetworkPhysicianClassLabels[
                    data.class as NetworkPhysicianClassType
                  ]
                }
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
