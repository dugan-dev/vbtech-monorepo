import { getPayersProcessingAccounts } from "@/repos/payload-processing-account-repository";

import { getPayloadClientId } from "@/lib/payload";

import { PayerProcessingAccountCardClient } from "./payer-processing-account-card.client";

type props = {
  payerPubId: string;
};

/**
 * Server component that retrieves a payload client token and processing accounts for a payer, then renders the processing account card.
 *
 * @param payerPubId - The public ID of the payer whose processing accounts are shown.
 * @returns A React element displaying the payer's processing account card.
 *
 * @throws {Error} If the payload client token cannot be loaded.
 */

export async function PayerProcessingAccountCardServer({ payerPubId }: props) {
  const [payloadClientToken, processingAccounts] = await Promise.all([
    getPayloadClientId("processing_account_plugin"),
    getPayersProcessingAccounts(payerPubId),
  ]);

  if (!payloadClientToken) {
    throw new Error("Failed to load payload client token.");
  }

  return (
    <PayerProcessingAccountCardClient
      payloadClientToken={payloadClientToken}
      payerPubId={payerPubId}
      processingAccounts={processingAccounts}
    />
  );
}
