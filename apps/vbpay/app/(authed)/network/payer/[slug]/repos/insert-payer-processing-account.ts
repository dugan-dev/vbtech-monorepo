import "server-only";

import { db } from "@workspace/db/database";

/**
 * Creates a new association between a payer and a processing account in the database.
 *
 * @param payerPubId - Public identifier of the payer.
 * @param processingAccountId - Identifier of the processing account to associate.
 * @param userId - Identifier of the user performing the operation.
 * @returns The result of the insertion operation.
 */
export async function insertPayerProcessingAccount(
  payerPubId: string,
  processingAccountId: string,
  userId: string,
) {
  return await db
    .insertInto("payerProcessingAccount")
    .values({
      payerPubId: payerPubId,
      pubId: processingAccountId,
      createdAt: new Date(),
      createdBy: userId,
    })
    .execute();
}
