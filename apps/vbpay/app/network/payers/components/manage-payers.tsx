import "server-only";

import { Suspense } from "react";
import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getUsersData } from "@/repos/user-repository";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";
import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getPayersForTable } from "../repos/get-payers-for-table";
import { ManagePayersTable } from "./manage-payers-table/manage-payers-table";

type props = {
  userId: string;
};

/**
 * Renders the UI for managing payers associated with a specific user.
 *
 * This asynchronous component concurrently fetches user attributes and global settings. It then retrieves the payers
 * based on the user's payer IDs and maps the allowed payer types (retrieved from global settings) into a UI-friendly
 * format for display within a table. If no payer IDs or allowed payer types are found, it returns an error view with a
 * corresponding message.
 *
 * @param userId - The unique identifier of the user whose payers are to be managed.
 *
 * @returns A React element that renders either an error view or the payers management table.
 */
export async function ManagePayers({ userId }: props) {
  const [{ usersAppAttrs }, globalSettings] = await Promise.all([
    getUsersData({
      userId,
    }),
    getVBPayGlobalSettings(),
  ]);

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

  const allowPayerTypes: PayerType[] | undefined =
    globalSettings?.allowedPayerTypes.split(",") as PayerType[];

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

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <ManagePayersTable
          payers={payers}
          usersAppAttrs={usersAppAttrs}
          payerTypes={payerTypes}
        />
      </Suspense>
    </div>
  );
}
