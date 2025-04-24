import { getPayerByPubId } from "@/repos/payer-repository";

import { formatEditPayerFormData } from "../../utils/format-edit-payer-form-data";
import { PayerInfoCardClient } from "./payer-info-card.client";

type props = {
  payerPubId: string;
};

/**
 * Renders a server-side payer information card for a given public payer ID.
 *
 * Retrieves payer details using the provided public ID, formats the data, and returns a client-side component to display the payer's information.
 *
 * @param payerPubId - The public identifier of the payer to display.
 * @returns A JSX element displaying the payer information card.
 *
 * @throws {Error} If no payer exists with the specified {@link payerPubId}.
 */
export async function PayerInfoCardServer({ payerPubId }: props) {
  const payer = await getPayerByPubId({ pubId: payerPubId });

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  const formData = formatEditPayerFormData(payer);

  return <PayerInfoCardClient data={formData} />;
}
