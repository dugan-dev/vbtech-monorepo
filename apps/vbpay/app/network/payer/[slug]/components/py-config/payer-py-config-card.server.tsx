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
 * Displays a payer configuration card view based on user and payer data for a given performance year.
 *
 * Fetches payer configuration, payer details, and user data concurrently, then renders the appropriate view depending on payer type and configuration availability. If the payer does not exist, an error is thrown.
 *
 * @param userId - The unique identifier for the user.
 * @param payerPubId - The public identifier for the payer.
 * @param perfYearUrl - Optional performance year; defaults to the current year if not provided.
 *
 * @returns A React element representing the payer configuration card or a relevant status view.
 *
 * @throws {Error} If no payer exists with the specified {@link payerPubId}.
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
