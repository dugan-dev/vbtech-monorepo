"use client";

import { NetworkEntity, NetworkPayer } from "@/routes";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Icons } from "@/components/icons";

import { EditPhysAffiliatesFormData } from "./edit-affiliates-form/edit-phys-affiliates-schema";
import { EditPhysAffiliatesSheet } from "./edit-phys-affiliates-sheet";

type props = {
  data: EditPhysAffiliatesFormData;
  payerPubId: string;
  payers: ComboItem[];
  pos: ComboItem[];
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

export function PhysAffiliatesCardClient({
  data,
  payerPubId,
  payers,
  pos,
  practices,
  facilities,
  vendors,
}: props) {
  const payer = payers.find((p) => p.value === payerPubId);
  const po = pos.find((p) => p.value === data.poNetEntPubId);
  const practice = practices.find((p) => p.value === data.pracNetEntPubId);
  const facility = facilities.find((p) => p.value === data.faclNetEntPubId);
  const vendor = vendors.find((p) => p.value === data.vendorNetEntPubId);

  const handlePopOutClick = (url: string) => {
    window.open(url, "_blank", "width=600px,height=600px,resizable,scrollbars");
  };

  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.heartHandshake className="size-6" />
          <CardTitle className="text-2xl">Affiliates</CardTitle>
          <div className="relative ml-auto">
            <EditPhysAffiliatesSheet
              formData={data}
              payerPubId={payerPubId}
              pos={pos}
              practices={practices}
              facilities={facilities}
              vendors={vendors}
            />
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payer:</span>
              <span className="font-medium text-end">
                <button
                  className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
                  onClick={() =>
                    handlePopOutClick(NetworkPayer({ slug: payer!.value }))
                  }
                >
                  {payer!.label}
                </button>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Practice:</span>
              <span className="font-medium text-end">
                {practice ? (
                  <button
                    className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
                    onClick={() =>
                      handlePopOutClick(NetworkEntity({ slug: practice.value }))
                    }
                  >
                    {practice.label}
                  </button>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider Org:</span>
              <span className="font-medium text-end">
                {po ? (
                  <button
                    className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
                    onClick={() =>
                      handlePopOutClick(NetworkEntity({ slug: po.value }))
                    }
                  >
                    {po.label}
                  </button>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Facility:</span>
              <span className="font-medium text-end">
                {facility ? (
                  <button
                    className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
                    onClick={() =>
                      handlePopOutClick(NetworkEntity({ slug: facility.value }))
                    }
                  >
                    {facility.label}
                  </button>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-medium text-end">
                {vendor ? (
                  <button
                    className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
                    onClick={() =>
                      handlePopOutClick(NetworkEntity({ slug: vendor.value }))
                    }
                  >
                    {vendor.label}
                  </button>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
