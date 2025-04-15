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
 * Renders a payer information card server-side by fetching and formatting payer, user, and global settings data.
 *
 * Retrieves payer details, user attributes, and allowed payer types concurrently. Throws an error if the payer or global settings are missing. Formats the payer data and allowed payer types, then renders the client-side payer information card within a user context provider.
 *
 * @param userId - The unique identifier of the user whose context is required.
 * @param payerPubId - The public identifier of the payer to display.
 * @returns A JSX element containing the payer information card.
 *
 * @throws {Error} If the payer with the specified {@link payerPubId} does not exist.
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
