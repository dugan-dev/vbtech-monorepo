import { getPayerByPubId } from "@/repos/payer-repository";

import { formatEditPayerFormData } from "../../utils/format-edit-payer-form-data";
import { PayerInfoCardClient } from "./payer-info-card.client";

type props = {
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
export async function PayerInfoCardServer({ payerPubId }: props) {
  const payer = await getPayerByPubId({ pubId: payerPubId });

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  const formData = formatEditPayerFormData(payer);

  return <PayerInfoCardClient data={formData} />;
}
