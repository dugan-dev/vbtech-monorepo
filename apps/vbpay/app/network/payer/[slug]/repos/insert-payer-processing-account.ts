import "server-only";

import { db } from "@workspace/db/database";

export function insertPayerProcessingAccount(
  payerPubId: string,
  processingAccountId: string,
  userId: string,
) {
  return db
    .insertInto("payerProcessingAccount")
    .values({
      payerPubId: payerPubId,
      pubId: processingAccountId,
      createdAt: new Date(),
      createdBy: userId,
    })
    .execute();
}
