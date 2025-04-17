"use client";

import Link from "next/link";
import { NetworkEntity, NetworkPayer } from "@/routes";

import { Button } from "@workspace/ui/components/button";
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
  return (
    <Card className="w-1/4 max-w-1/3 hover:transform hover:scale-105 transition duration-300">
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
                <Button
                  variant="link"
                  onClick={() =>
                    window.open(
                      NetworkPayer({ slug: payer!.value }),
                      "_blank",
                      "width=80dvw,height=80dvh,resizable,scrollbars",
                    )
                  }
                >
                  {payer!.label}
                </Button>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Practice:</span>
              <span className="font-medium text-end">
                {practice ? (
                  <Link href={NetworkEntity({ slug: practice.value })}>
                    {practice.label}
                  </Link>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider Org:</span>
              <span className="font-medium text-end">
                {po ? (
                  <Link href={NetworkEntity({ slug: po.value })}>
                    {po.label}
                  </Link>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Facility:</span>
              <span className="font-medium text-end">
                {facility ? (
                  <Link href={NetworkEntity({ slug: facility.value })}>
                    {facility.label}
                  </Link>
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-medium text-end">
                {vendor ? (
                  <Link
                    target="_blank"
                    href={NetworkEntity({ slug: vendor.value })}
                  >
                    {vendor.label}
                  </Link>
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
