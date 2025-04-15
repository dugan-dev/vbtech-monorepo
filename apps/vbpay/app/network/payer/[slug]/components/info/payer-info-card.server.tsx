import { UserProvider } from "@/contexts/user-context";
import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getPayerByPubId } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

import { formatEditPayerFormData } from "../../utils/format-edit-payer-form-data";
import { PayerInfoCardClient } from "./payer-info-card.client";

type props = {
  userId: string;
  payerPubId: string;
};

/**
 * Server component that renders a payer information card with user context.
 *
 * Fetches payer details, user data, and global settings concurrently. Throws an error if the payer or global settings cannot be retrieved. Formats payer data for editing and prepares a selectable list of allowed payer types before rendering the client-side payer information card within a user context provider.
 *
 * @param userId - The unique identifier of the user whose context is provided.
 * @param payerPubId - The public identifier of the payer whose information is displayed.
 * @returns A JSX element rendering the payer information card within a user context.
 *
 * @throws {Error} If the payer with the specified {@link payerPubId} is not found.
 * @throws {Error} If global settings cannot be loaded.
 */
export async function PayerInfoCardServer({ userId, payerPubId }: props) {
  const [payer, user, settings] = await Promise.all([
    getPayerByPubId({ pubId: payerPubId }),
    getUsersData({ userId }),
    getVBPayGlobalSettings(),
  ]);

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  if (!settings) {
    throw new Error("Failed to load global settings.");
  }

  const formData = formatEditPayerFormData(payer);

  const payerTypes: ComboItem[] = settings.allowedPayerTypes
    .split(",")
    .map((type) => ({
      value: type,
      label: PayerTypeLabels[type as PayerType],
    }));

  return (
    <div className="w-1/4">
      <UserProvider usersAppAttrs={user.usersAppAttrs}>
        <PayerInfoCardClient data={formData} payerTypes={payerTypes} />
      </UserProvider>
    </div>
  );
}
