import "server-only";

import { Suspense } from "react";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { getNetworkEntitiesForTable } from "../repos/getNetworkEntitiesForTable";
import { ManageNetworkEntitiesTable } from "./manage-network-entities-table/manage-network-entities-table";

type props = {
  payerIdUrlParam?: string;
};

export async function ManageNetworkEntities({ payerIdUrlParam }: props) {
  /*const [usersType, payers, userSelectedPayer] = await Promise.all([
    //getUserType(),
    getAllPayers(),
    //getUserSelectedId(),
  ]);
  /*
  if (usersType !== "bpo" && usersType !== "aco" && usersType !== "payer") {
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

  const selectedPayerId = payerIdUrlParam
    ? (payerIdUrlParam as string)
    : userSelectedPayer;
  const isPayerIdValid = payers.some(
    (payer) => payer.pubId === selectedPayerId,
  );

  if (!isPayerIdValid) {
    return (
      <MissingInvalidView
        title="Invalid Payer ID Search Parameter"
        description="The provided Payer ID is invalid. Please try again. If the problem persists please contact support."
      />
    );
  }
*/

  // TODO: pass in userSelectedPayer to table
  const entities = await getNetworkEntitiesForTable({
    selectedPayer: payerIdUrlParam || "",
  });

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManageNetworkEntitiesTable
          entities={entities}
          // TODO: pass userType
          usersType={"bpo"}
        />
      </Suspense>
    </div>
  );
}
