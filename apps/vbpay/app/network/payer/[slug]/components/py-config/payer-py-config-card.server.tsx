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
 * Displays the payer configuration card view for a given user and payer.
 *
 * Fetches payer configuration, payer details, and user data for the specified performance year, then renders the appropriate React component based on payer type and configuration availability.
 *
 * @param userId - Identifier for the user whose context is used.
 * @param payerPubId - Public identifier for the payer.
 * @param perfYearUrl - Optional performance year; defaults to the current year if not provided.
 * @returns A React element representing the payer configuration view.
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
    <UserProvider usersAppAttrs={user.usersAppAttrs}>
      <PayerPyConfigCardClient
        perfYear={perfYear}
        data={formData}
        payerPubId={payerPubId}
        pubId={payerPyConfig?.pubId}
      />
    </UserProvider>
  );
}
