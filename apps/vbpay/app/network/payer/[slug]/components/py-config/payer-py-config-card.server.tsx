import { UserProvider } from "@/contexts/user-context";
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
 * This asynchronous function concurrently retrieves the payer configuration, payer details, and user data,
 * determines the appropriate view based on the payer type and configuration availability, and renders the
 * corresponding React component. It calculates the performance year from the provided URL or defaults to the
 * current year.
 *
 * If the payer object is not found, the function throws an error. If the payer type is not "aco", an unsupported
 * payer type view is rendered. If a payer configuration is not available, a view prompting for configuration is returned.
 * Otherwise, the configuration data is formatted and used to render a detailed card view.
 *
 * @param userId - The user identifier.
 * @param payerPubId - The payer's public identifier.
 * @param perfYearUrl - An optional performance year URL; the current year is used when not provided.
 *
 * @returns A React element representing the payer configuration view.
 *
 * @throws {Error} If the payer with the specified public identifier does not exist.
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
      <UserProvider usersAppAttrs={user.usersAppAttrs}>
        <PayerPyConfigCardClient
          perfYear={perfYear}
          data={formData}
          payerPubId={payerPubId}
          pubId={payerPyConfig?.pubId}
        />
      </UserProvider>
    </div>
  );
}
