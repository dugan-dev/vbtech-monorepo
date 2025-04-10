import { getPayerByPubId } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";

import { PayerType } from "@/types/payer-type";

import { getPayerPyConfig } from "../../repos/payer-py-config-repository";
import { formatPayerPyConfigFormData } from "../../utils/format-payer-py-config-form-data";
import { NoPayerConfigView } from "./no-payer-config-view";
import { PayerPyConfigCardClient } from "./payer-py-config-card.client";
import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigUnsupportedPayerType } from "./payer-py-config-unsupported-payer-type";

type props = {
  userId: string;
  payerPubId: string;
  perfYearUrl?: string;
};

/**
 * Renders a payer configuration card view.
 *
 * This asynchronous function concurrently retrieves payer configuration data, payer details,
 * and user data, then determines and renders the appropriate view based on the payer type
 * and the availability of configuration data. It computes the performance year from the provided
 * URL or defaults to the current year. If the payer type is not "aco", an unsupported payer type
 * view is returned. If the payer configuration does not exist, a no configuration view is rendered.
 * Otherwise, it formats the configuration data and renders a card component displaying the details.
 *
 * @param userId - The identifier of the user.
 * @param payerPubId - The public identifier of the payer.
 * @param perfYearUrl - Optional performance year; defaults to the current year if not provided.
 *
 * @returns A React component representing the payer configuration card view.
 */
export async function PayerPyConfigCardServer({
  userId,
  payerPubId,
  perfYearUrl,
}: props) {
  const perfYear = perfYearUrl ?? new Date().getFullYear().toString();
  const [payerPyConfig, payer, user] = await Promise.all([
    getPayerPyConfig(payerPubId, perfYear),
    getPayerByPubId({ pubId: payerPubId }),
    getUsersData({ userId }),
  ]);

  let formData: PayerPyConfigFormData | undefined = undefined;

  if ((payer?.payerType as PayerType) !== "aco") {
    return <PayerPyConfigUnsupportedPayerType perfYear={perfYear} />;
  }

  if (payerPyConfig) {
    formData = formatPayerPyConfigFormData(payerPyConfig);
  } else {
    return (
      <NoPayerConfigView
        userId={userId}
        perfYear={perfYear}
        payerPubId={payerPubId}
      />
    );
  }

  return (
    <div className="w-1/3">
      <PayerPyConfigCardClient
        perfYear={perfYear}
        data={formData}
        payerPubId={payerPubId}
        pubId={payerPyConfig?.pubId}
        usersAppAttrs={user.usersAppAttrs}
      />
    </div>
  );
}
