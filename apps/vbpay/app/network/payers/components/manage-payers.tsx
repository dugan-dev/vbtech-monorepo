import "server-only";

import { Suspense } from "react";
import { getUsersData } from "@/repos/user-repository";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { PayerTypeLabels, PayerTypes } from "@/types/payer-type";
import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getPayersForTable } from "../repos/get-payers-for-table";
import { ManagePayersTable } from "./manage-payers-table/manage-payers-table";

type props = {
  userId: string;
};

export async function ManagePayers({ userId }: props) {
  const { usersAppAttrs } = await getUsersData({
    userId,
  });

  if (!usersAppAttrs.ids || usersAppAttrs.ids.length === 0) {
    return (
      <MissingInvalidView
        title="Missing Users Allowed Payer IDs"
        description="The user does not have any payer ids associated with their auth permissions. Please try again. If the problem persists please contact support."
      />
    );
  }

  const payers = await getPayersForTable({
    usersPayerPubIds: usersAppAttrs.ids.map((id) => id.id),
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
          usersAppAttrs={usersAppAttrs}
          // TODO: replace with allowed payerTypes from globalSettings
          payerTypes={PayerTypes.map((type) => ({
            label: PayerTypeLabels[type],
            value: type,
          }))}
        />
      </Suspense>
    </div>
  );
}
