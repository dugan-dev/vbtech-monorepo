import { getPayerByPubId } from "@/repos/payer-repository";

import { PayerType } from "@/types/payer-type";

import { getPayerPyConfig } from "../../repos/payer-py-config-repository";
import { formatPayerPyConfigFormData } from "../../utils/format-payer-py-config-form-data";
import { NoPayerConfigView } from "./no-payer-config-view";
import { PayerPyConfigCardClient } from "./payer-py-config-card.client";
import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigUnsupportedPayerType } from "./payer-py-config-unsupported-payer-type";

type props = {
  payerPubId: string;
  perfYearUrl?: string;
};

/**
 * Displays the payer configuration card for a given payer and performance year.
 *
 * Fetches payer details and configuration using the provided payer public ID and performance year, then renders the appropriate UI based on payer type and configuration presence.
 *
 * @param payerPubId - The public identifier of the payer.
 * @param perfYearUrl - Optional performance year; defaults to the current year if omitted.
 * @returns A React element representing the payer configuration card or an appropriate fallback view.
 *
 * @throws {Error} If no payer exists with the specified {@link payerPubId}.
 */
export async function PayerPyConfigCardServer({
  payerPubId,
  perfYearUrl,
}: props) {
  const perfYear = perfYearUrl ?? new Date().getFullYear().toString();
  const [payerPyConfig, payer] = await Promise.all([
    getPayerPyConfig(payerPubId, perfYear),
    getPayerByPubId({ pubId: payerPubId }),
  ]);

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  let formData: PayerPyConfigFormData | undefined = undefined;

  if ((payer.payerType as PayerType) !== "aco") {
    return <PayerPyConfigUnsupportedPayerType perfYear={perfYear} />;
  }

  if (payerPyConfig) {
    formData = formatPayerPyConfigFormData(payerPyConfig);
  } else {
    return <NoPayerConfigView perfYear={perfYear} payerPubId={payerPubId} />;
  }

  return (
    <PayerPyConfigCardClient
      perfYear={perfYear}
      data={formData}
      payerPubId={payerPubId}
      pubId={payerPyConfig?.pubId}
    />
  );
}
