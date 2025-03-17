import { Suspense } from "react";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkEntityType } from "@/types/network-entity-type";

import { getNetworkEntitiesForAffiliation } from "../repos/get-network-entities-for-affiliation";
import { getNetworkPhysiciansForTable } from "../repos/get-network-physicians-for-table";
import { ManageNetworkPhysiciansTable } from "./manage-network-physicians-table/manage-network-physicians-table";

type props = {
  payerIdUrlParam?: string;
};

export async function ManageNetworkPhysicians({ payerIdUrlParam }: props) {
  // TODO: Add validation checks
  /* const [usersType, payers, userSelectedPayer] = await Promise.all([
    getUserType(),
    getAllPayers(),
    getUserSelectedId(),
  ]);

  if (usersType !== "bpo" && usersType !== "aco") {
    forbidden();
  }

  if (!payerIdUrlParam && !userSelectedPayer) {
    return (
      <MissingInvalidView
        title="Missing Payer ID Search Parameter"
        description="The Payer ID search parameter is missing. Please try again. If the problem persists please contact support."
      />
    );
  }

  const selectedPayer = payerIdUrlParam
    ? (payerIdUrlParam as string)
    : userSelectedPayer;
  const isPayerIdValid = payers.some((payer) => payer.pubId === selectedPayer);

  if (!isPayerIdValid) {
    return (
      <MissingInvalidView
        title="Invalid Payer ID Search Parameter"
        description="The provided Payer ID is invalid. Please try again. If the problem persists please contact support."
      />
    );
  }*/

  const [physicians, entities] = await Promise.all([
    // TODO: Add filter for selectedPayer
    getNetworkPhysiciansForTable({
      selectedPayer: payerIdUrlParam ? payerIdUrlParam : "",
    }),
    // TODO: Add filter for selectedPayer
    getNetworkEntitiesForAffiliation({
      selectedPayer: payerIdUrlParam ? payerIdUrlParam : "",
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
          // TODO: Use usersType
          usersType={"bpo"}
          pos={pos}
          pratices={pratices}
          facilitites={facilitites}
          vendors={vendors}
        />
      </Suspense>
    </div>
  );
}
