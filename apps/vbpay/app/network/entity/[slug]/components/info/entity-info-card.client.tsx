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
};

/**
 * Renders a card displaying network entity details along with an edit option for users with proper access.
 *
 * The card header shows the network entity type and conditionally includes an edit interface,
 * which is only available to users with the required attributes and roles.
 * The card content displays the entity's name (including a reference name when available), organization NPI,
 * and entity type.
 *
 * @param data - Contains the network entity's details such as marketing name, optional reference name, organization NPI, and type.
 * @param usersAppAttrs - User-specific attributes used to determine access permissions for editing.
 */
export function EntityInfoCardClient({ data, usersAppAttrs }: props) {
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
              <EditEntitySheet formData={data} />
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
