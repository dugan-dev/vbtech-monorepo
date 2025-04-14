"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import {
  NetworkEntityType,
  NetworkEntityTypeLabels,
} from "@/types/network-entity-type";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { EditEntityFormData } from "./edit-entity-form/edit-entity-form-schema";
import { EditEntitySheet } from "./edit-entity-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLES: UserRole[] = ["edit"];

type props = {
  data: EditEntityFormData;
  usersAppAttrs: UserAppAttrs;
  payerPubId: string;
};

/**
 * Displays a card with network entity information and an edit option for authorized users.
 *
 * The card shows the entity's name, organization NPI, and type. An edit interface is conditionally rendered in the header for users with the appropriate attributes and roles.
 *
 * @param data - Network entity details, including marketing name, optional reference name, organization NPI, and type.
 * @param usersAppAttrs - Attributes used to determine if the user can access editing features.
 * @param payerPubId - Identifier associated with the payer, passed to the edit interface.
 */
export function EntityInfoCardClient({
  data,
  usersAppAttrs,
  payerPubId,
}: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>
            {NetworkEntityTypeLabels[data.netEntType as NetworkEntityType]}{" "}
            Information
          </CardTitle>
          <RestrictByUserAppAttrsClient
            usersAppAttrs={usersAppAttrs}
            allowedUserTypes={ALLOWED_USER_TYPES}
            requiredUserRoles={REQUIRED_USER_ROLES}
          >
            <div className="relative ml-auto">
              <EditEntitySheet formData={data} payerPubId={payerPubId} />
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
              <span className="text-muted-foreground">Org NPI:</span>
              <span className="font-medium text-end">
                {data.orgNpi ? data.orgNpi : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-end">
                {NetworkEntityTypeLabels[data.netEntType as NetworkEntityType]}
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
