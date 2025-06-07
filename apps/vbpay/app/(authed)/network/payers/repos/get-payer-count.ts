import { db } from "@workspace/db/database";

/**
 * Returns the total number of payer records in the database.
 *
 * @returns An object containing the total count of payers as the "payerCount" property.
 */
export async function getPayerCount() {
  return await db
    .selectFrom("payer")
    .select(db.fn.count<number>("pubId").as("payerCount"))
    .executeTakeFirst();
}
