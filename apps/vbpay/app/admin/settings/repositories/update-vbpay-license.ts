import "server-only";

import { VBPayLicense } from "@/repos/license-repository";

import { db } from "@workspace/db/database";

/**
 * Updates a VBPay license record and archives its previous state.
 *
 * This asynchronous function performs a database transaction that first logs the current VBPay license
 * data into the `vbpayLicenseHist` table by inserting a record with various license details and a timestamp.
 * It then updates the `vbpayLicense` table with the new license information, setting the update timestamp
 * and recording the user responsible for the change. If any part of the transaction fails, all operations
 * are rolled back.
 *
 * @param license - New license details to be applied.
 * @param userId - Identifier for the user performing the update.
 * @returns The result of the update operation.
 */
export async function updateVBPayLicense({
  license,
  userId,
}: {
  license: VBPayLicense;
  userId: string;
}) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("vbpayLicenseHist")
      .columns([
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "type",
        "fromDate",
        "toDate",
        "clientName",
        "pocName",
        "pocPhone",
        "pocEmail",
        "numPayers",
        "paymentTypes",
        "functionality",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("vbpayLicense")
          .select([
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "type",
            "fromDate",
            "toDate",
            "clientName",
            "pocName",
            "pocPhone",
            "pocEmail",
            "numPayers",
            "paymentTypes",
            "functionality",
            eb.val(new Date()).as("histAddedAt"),
          ]),
      )
      .execute();

    return trx
      .updateTable("vbpayLicense")
      .set({
        ...license,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();
  });
}
