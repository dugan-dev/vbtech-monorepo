import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { db } from "@workspace/db/database";

import "server-only";

/**
 * Updates the global VBPay settings and records the previous settings in a history table within a single transaction.
 *
 * @param settings - The new global settings to apply.
 * @param userId - The identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 *
 * @remark The update and history insertion are performed atomically; if any step fails, no changes are committed.
 */
export async function updateVBPayGlobalSettings({
  settings,
  userId,
}: {
  settings: VBPayGlobalSettings;
  userId: string;
}) {
  const now = new Date();
  return await db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("vbpayGlobalSettingsHist")
      .columns([
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "allowedPayerTypes",
        "payerReqTaxId",
        "poReqTaxId",
        "poReqNpi",
        "pracReqNpi",
        "pracReqTaxId",
        "physReqTaxId",
        "physReqCred",
        "physReqSpec",
        "physNppesRecon",
        "faclReqNpi",
        "faclReqTaxId",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("vbpayGlobalSettings")
          .select([
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "allowedPayerTypes",
            "payerReqTaxId",
            "poReqTaxId",
            "poReqNpi",
            "pracReqNpi",
            "pracReqTaxId",
            "physReqTaxId",
            "physReqCred",
            "physReqSpec",
            "physNppesRecon",
            "faclReqNpi",
            "faclReqTaxId",
            eb.val(now).as("histAddedAt"),
          ]),
      )
      .execute();

    // update existing settings
    await trx
      .updateTable("vbpayGlobalSettings")
      .set({
        ...settings,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();

    return { success: true };
  });
}
