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
 * Asynchronously renders a payer information card.
 *
 * Fetches payer details using the provided public payer ID, user data using the specified user ID, and global settings concurrently.
 * If either the payer or the global settings cannot be retrieved, an error is thrown.
 * The function formats the payer information for editing and converts allowed payer types into a selectable list
 * before passing the data to the client-side payer information card component.
 *
 * @param userId - Identifier for the user.
 * @param payerPubId - Public identifier for the payer.
 * @returns A JSX element that renders the payer information card.
 *
 * @throws {Error} If the payer with the specified public identifier is not found.
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
      <PayerInfoCardClient
        data={formData}
        usersAppAttrs={user.usersAppAttrs}
        payerTypes={payerTypes}
      />
    </div>
  );
}
