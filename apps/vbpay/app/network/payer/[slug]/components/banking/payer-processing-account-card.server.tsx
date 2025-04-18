import { UserProvider } from "@/contexts/user-context";
import { getPayerByPubId } from "@/repos/payer-repository";
import {
  getPayersProcessingAccounts,
  getPayloadClientId,
} from "@/repos/payload-processing-account-repository";
import { getUsersData } from "@/repos/user-repository";

import { PayerProcessingAccountCardClient } from "./payer-processing-account-card.client";

type props = {
  userId: string;
  payerPubId: string;
};

export async function PayerProcessingAccountCardServer({
  userId,
  payerPubId,
}: props) {
  const [payer, user, payloadClientToken, processingAccounts] =
    await Promise.all([
      getPayerByPubId({ pubId: payerPubId }),
      getUsersData({ userId }),
      getPayloadClientId("processing_account_plugin"),
      getPayersProcessingAccounts(payerPubId),
    ]);

  if (!payer) {
    throw new Error(`Payer with pubId ${payerPubId} not found.`);
  }

  if (!payloadClientToken) {
    throw new Error("Failed to load payload client token.");
  }

  return (
    <UserProvider usersAppAttrs={user.usersAppAttrs}>
      <PayerProcessingAccountCardClient
        payloadClientToken={payloadClientToken}
        payerPubId={payerPubId}
        processingAccounts={processingAccounts}
      />
    </UserProvider>
  );
}
