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
 * Retrieves payer, user, and global settings concurrently to render a payer information card.
 *
 * This server-side component fetches payer details using the specified public payer ID, user data using
 * the given user ID, and global settings that include the allowed payer types. It formats the payer data
 * for editing and converts the allowed payer types into a selectable list of options. The resulting data
 * is passed to the client-side PayerInfoCardClient component wrapped in a container div.
 *
 * @param userId - Identifier for the user.
 * @param payerPubId - Public identifier for the payer.
 * @returns JSX element rendering the payer information card.
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
