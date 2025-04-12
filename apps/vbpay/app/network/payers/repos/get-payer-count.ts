import { db } from "@workspace/db/database";

export function getPayerCount() {
  return db
    .selectFrom("payer")
    .select(db.fn.count<number>("pubId").as("payerCount"))
    .executeTakeFirst();
}
