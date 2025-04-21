import { UserProvider } from "@/contexts/user-context";
import { getPayersProcessingAccounts } from "@/repos/payload-processing-account-repository";
import { getUsersData } from "@/repos/user-repository";

import { getPayloadClientId } from "@/lib/payload";

import { PayerProcessingAccountCardClient } from "./payer-processing-account-card.client";

type props = {
  userId: string;
  payerPubId: string;
};

/**
 * Server component to fetch payer, user, payload client token, and processing account data,
 * then render the PayerProcessingAccountCardClient wrapped with UserProvider.
 *
 * @param props - Component properties
 * @param props.userId - The ID of the current user
 * @param props.payerPubId - The public ID of the payer
 * @returns A React element displaying the processing account card within the user context
 */

export async function PayerProcessingAccountCardServer({
  userId,
  payerPubId,
}: props) {
  const [user, payloadClientToken, processingAccounts] = await Promise.all([
    getUsersData({ userId }),
    getPayloadClientId("processing_account_plugin"),
    getPayersProcessingAccounts(payerPubId),
  ]);

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
