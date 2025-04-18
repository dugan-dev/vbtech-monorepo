import "server-only";

import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getUsersData } from "@/repos/user-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";
import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getPayersForTable } from "../repos/get-payers-for-table";
import { ManagePayersTable } from "./manage-payers-table/manage-payers-table";

type props = {
  userId: string;
};

/**
 * Displays a management interface for payers linked to a specific user.
 *
 * Fetches user attributes and global payer settings, then renders a table for managing the user's payers. If required payer IDs or allowed payer types are missing, shows an error view instead.
 *
 * @param userId - The unique identifier of the user whose payers are being managed.
 *
 * @returns A React element with either the payers management table or an error view if prerequisites are missing.
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
      <ManagePayersTable
        payers={payers}
        usersAppAttrs={usersAppAttrs}
        payerTypes={payerTypes}
      />
    </div>
  );
}
