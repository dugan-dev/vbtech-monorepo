import { Suspense } from "react";
import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkEntityType } from "@/types/network-entity-type";
import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getNetworkEntitiesForAffiliation } from "../repos/get-network-entities-for-affiliation";
import { getNetworkPhysiciansForTable } from "../repos/get-network-physicians-for-table";
import { ManageNetworkPhysiciansTable } from "./manage-network-physicians-table/manage-network-physicians-table";

type props = {
  payerIdUrlParam?: string;
  userId: string;
};

export async function ManageNetworkPhysicians({
  payerIdUrlParam,
  userId,
}: props) {
  const [payers, { usersAppAttrs }] = await Promise.all([
    getAllPayers(),
    getUsersData({ userId }),
  ]);

  if (!payerIdUrlParam && !usersAppAttrs.slug) {
    return (
      <MissingInvalidView
        title="Missing Payer ID Search Parameter"
        description="The Payer ID search parameter is missing. Please try again. If the problem persists please contact support."
      />
    );
  }

  const selectedPayer = payerIdUrlParam
    ? (payerIdUrlParam as string)
    : usersAppAttrs.slug;
  const isPayerIdValid = payers.some((payer) => payer.pubId === selectedPayer);

  if (!isPayerIdValid) {
    return (
      <MissingInvalidView
        title="Invalid Payer ID Search Parameter"
        description="The provided Payer ID is invalid. Please try again. If the problem persists please contact support."
      />
    );
  }

  const [physicians, entities] = await Promise.all([
    getNetworkPhysiciansForTable({
      selectedPayer: payerIdUrlParam ?? usersAppAttrs.slug ?? "",
    }),
    getNetworkEntitiesForAffiliation({
      selectedPayer: payerIdUrlParam ?? usersAppAttrs.slug ?? "",
    }),
  ]);

  const pos: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "po")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const pratices: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "prac")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const facilitites: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "facl")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  const vendors: ComboItem[] = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "vendor")
    .map((entity) => ({
      value: entity.pubId,
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
    }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManageNetworkPhysiciansTable
          physicians={physicians}
          usersAppAttrs={usersAppAttrs}
          pos={pos}
          pratices={pratices}
          facilitites={facilitites}
          vendors={vendors}
        />
      </Suspense>
    </div>
  );
}
