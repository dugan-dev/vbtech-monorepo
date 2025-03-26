import "server-only";

import { Suspense } from "react";
import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getNetworkEntitiesForTable } from "../repos/getNetworkEntitiesForTable";
import { ManageNetworkEntitiesTable } from "./manage-network-entities-table/manage-network-entities-table";

type props = {
  payerIdUrlParam?: string;
  userId: string;
};

export async function ManageNetworkEntities({
  payerIdUrlParam,
  userId,
}: props) {
  const [{ usersAppAttrs }, payers] = await Promise.all([
    getUsersData({ userId }),
    getAllPayers(),
  ]);

  if (!payerIdUrlParam && !usersAppAttrs.slug) {
    return (
      <MissingInvalidView
        title="Missing Payer ID Search Parameter"
        description="The Payer ID search parameter is missing. Please try again. If the problem persists please contact support."
      />
    );
  }

  const selectedPayerId = payerIdUrlParam
    ? (payerIdUrlParam as string)
    : usersAppAttrs.slug;
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

  const entities = await getNetworkEntitiesForTable({
    selectedPayer: payerIdUrlParam || usersAppAttrs.slug || "",
  });

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManageNetworkEntitiesTable
          entities={entities}
          usersAppAttrs={usersAppAttrs}
        />
      </Suspense>
    </div>
  );
}
