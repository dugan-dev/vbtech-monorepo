import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

import { db } from "@workspace/db/database";

import "server-only";

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
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();
  });
}
