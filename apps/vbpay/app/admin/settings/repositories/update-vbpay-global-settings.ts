import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { db } from "@workspace/db/database";

import "server-only";

/**
 * Updates VBPay global settings and logs the current settings to a history table.
 *
 * This asynchronous function runs within a database transaction to ensure atomicity. It first logs the
 * existing settings from the "vbpayGlobalSettings" table into the "vbpayGlobalSettingsHist" history table,
 * recording the current timestamp. It then updates the global settings with the values provided in the
 * settings parameter while capturing the update time and the user performing the update.
 *
 * @param settings - The new VBPay global settings to apply.
 * @param userId - The identifier of the user performing the update.
 * @returns A promise resolving to the result of the update operation.
 */
export async function updateVBPayGlobalSettings({
  settings,
  userId,
}: {
  settings: VBPayGlobalSettings;
  userId: string;
}) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
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
    return trx
      .updateTable("vbpayGlobalSettings")
      .set({
        ...settings,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .execute();
  });
}
