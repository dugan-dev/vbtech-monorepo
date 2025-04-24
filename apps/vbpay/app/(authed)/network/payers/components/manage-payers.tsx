import "server-only";

import { getUsersData } from "@/repos/user-repository";

import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getPayersForTable } from "../repos/get-payers-for-table";
import { ManagePayersTable } from "./manage-payers-table/manage-payers-table";

type props = {
  userId: string;
};

/**
 * Renders a management interface for payers associated with a given user.
 *
 * Fetches user attributes to determine payer IDs linked to the user. If no payer IDs are found, displays an error view. Otherwise, retrieves payer data and displays it in a management table.
 *
 * @param userId - The unique identifier of the user whose payers are being managed.
 *
 * @returns A React element containing either the payers management table or an error view if no payer IDs are associated with the user.
 */
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

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <ManagePayersTable payers={payers} />
    </div>
  );
}
