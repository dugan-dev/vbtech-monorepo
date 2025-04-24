import { getPayerByPubId } from "@/repos/payer-repository";

import { formatEditPayerFormData } from "../../utils/format-edit-payer-form-data";
import { PayerInfoCardClient } from "./payer-info-card.client";

type props = {
  payerPubId: string;
};

/**
 * Renders a server-side payer information card for the specified payer.
 *
 * Fetches payer details by public ID, formats the data, and returns a client-side component to display the information.
 *
 * @param payerPubId - The public identifier of the payer to display.
 * @returns A JSX element containing the payer information card.
 *
 * @throws {Error} If the payer with the specified {@link payerPubId} does not exist.
 */
export async function PayerInfoCardServer({ payerPubId }: props) {
  const payer = await getPayerByPubId({ pubId: payerPubId });

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  const formData = formatEditPayerFormData(payer);

  return <PayerInfoCardClient data={formData} />;
}
