import { db } from "@workspace/db/database";

/**
 * Retrieves the total number of payer records from the database.
 *
 * Executes a query on the "payer" table to count entries based on the "pubId" column,
 * returning the result as an object with the count aliased as "payerCount".
 *
 * @returns A promise that resolves to an object containing the "payerCount" property.
 */
export async function getPayerCount() {
  return await db
    .selectFrom("payer")
    .select(db.fn.count<number>("pubId").as("payerCount"))
    .executeTakeFirst();
}
