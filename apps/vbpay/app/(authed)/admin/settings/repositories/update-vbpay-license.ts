import "server-only";

import { VBPayLicense } from "@/repos/license-repository";

import { db } from "@workspace/db/database";

/**
 * Updates the VBPay license record and logs the previous state to the history table within a single transaction.
 *
 * @param license - The new license data to be saved.
 * @param userId - The identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 *
 * @remark The update and historical logging are performed atomically; if either operation fails, no changes are committed.
 */
export async function updateVBPayLicense({
  license,
  userId,
}: {
  license: VBPayLicense;
  userId: string;
}) {
  const now = new Date();
  return await db.transaction().execute(async (trx) => {
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
            eb.val(now).as("histAddedAt"),
          ]),
      )
      .execute();

    await trx
      .updateTable("vbpayLicense")
      .set({
        ...license,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();

    return { success: true };
  });
}
