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

import { EditEntityFormData } from "./edit-entity-form/edit-entity-form-schema";
import { EditEntitySheet } from "./edit-entity-sheet";

type props = {
  data: EditEntityFormData;
  payerPubId: string;
};

/**
 * Displays a card with network entity details and an always-available edit option.
 *
 * Shows the entity's marketing name (with reference name if present), organization NPI, and type. The edit interface is always rendered and receives the entity data and payer public ID.
 *
 * @param data - Network entity details including marketing name, optional reference name, organization NPI, and type.
 * @param payerPubId - Public ID of the payer associated with the network entity.
 */
export function EntityInfoCardClient({ data, payerPubId }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>
            {NetworkEntityTypeLabels[data.netEntType as NetworkEntityType]}{" "}
            Information
          </CardTitle>
          <div className="relative ml-auto">
            <EditEntitySheet formData={data} payerPubId={payerPubId} />
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
