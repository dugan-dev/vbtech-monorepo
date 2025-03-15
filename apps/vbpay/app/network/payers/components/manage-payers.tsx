import "server-only";

import { Suspense } from "react";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { PayerTypeLabels, PayerTypes } from "@/types/payer-type";

import { getPayersForTable } from "../repos/get-payers-for-table";
import { ManagePayersTable } from "./manage-payers-table/manage-payers-table";

export async function ManagePayers() {
  /*
  const [usersType, usersAllowedIds, globalSettings] = await Promise.all([
    getUserType(),
    getUserAllowedIds(),
    getGlobalSettings(),
  ]);

  if (usersType !== "bpo" && usersType !== "aco" && usersType !== "payer") {
    forbidden();
  }

  if (usersAllowedIds.length === 0) {
    return (
      <MissingInvalidView
        title="Missing Users Allowed Payer IDs"
        description="The user does not have any payer ids associated with their auth permissions. Please try again. If the problem persists please contact support."
      />
    );
  }
  */

  const payers = await getPayersForTable({
    usersPayerPubIds: [""],
  });

  /*
  const allowPayerTypes: PayerType[] | undefined =
    globalSettings?.payerTypes.split(",") as PayerType[] | undefined;

  if (!allowPayerTypes || allowPayerTypes.length === 0) {
    return (
      <MissingInvalidView
        title="Missing Payer Types"
        description="The system is missing the list of allowed payer types. Please try again. If the problem persists please contact support."
      />
    );
  }
  
  const payerTypes: ComboItem[] = allowPayerTypes.map((type) => ({
    label: PayerTypeLabels[type],
    value: type,
  }));
  */

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManagePayersTable
          payers={payers}
          // TODO: replace with usersType
          usersType={"bpo"}
          // TODO: replace with payerTypes
          payerTypes={PayerTypes.map((type) => ({
            label: PayerTypeLabels[type],
            value: type,
          }))}
        />
      </Suspense>
    </div>
  );
}
