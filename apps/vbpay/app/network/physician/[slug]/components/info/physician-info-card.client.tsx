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

import { EditPhysicianFormData } from "./edit-physician-form/edit-physician-form-schema";
import { EditPhysicianSheet } from "./edit-physician-sheet";

type props = {
  data: EditPhysicianFormData;
  payerPubId: string;
};

/**
 * Displays a card with detailed physician information, including name, NPI, type, and class, with an option to edit the details.
 *
 * @param data - Physician details to display.
 * @param payerPubId - Identifier for the payer associated with the physician.
 */
export function PhysicianInfoCardClient({ data, payerPubId }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Physician Information</CardTitle>
          <div className="relative ml-auto">
            <EditPhysicianSheet formData={data} payerPubId={payerPubId} />
          </div>
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
