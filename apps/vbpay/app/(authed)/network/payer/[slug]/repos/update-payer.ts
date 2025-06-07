import "server-only";

import { db } from "@workspace/db/database";

import { EditPayerFormOutput } from "../components/info/edit-payer-form/edit-payer-form-schema";

type props = {
  input: EditPayerFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Atomically updates a payer's record and archives its previous state in a history table.
 *
 * The existing payer data is first copied to the `payerHist` table with a timestamp, then the payer record is updated with new details. All operations occur within a single transaction to ensure consistency and auditability.
 *
 * @param input - Updated payer details to apply.
 * @param pubId - Public identifier of the payer to update.
 * @param userId - Identifier of the user performing the update.
 * @returns An object indicating successful completion of the update.
 */
export async function updatePayer({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("payerHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "payerType",
        "initPerfYr",
        "initPerfMo",
        "cmsId",
        "marketingName",
        "legalName",
        "referenceName",
        "taxId",
        "parentOrgName",
        "websiteUrl",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("payer")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "payerType",
            "initPerfYr",
            "initPerfMo",
            "cmsId",
            "marketingName",
            "legalName",
            "referenceName",
            "taxId",
            "parentOrgName",
            "websiteUrl",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    await trx
      .updateTable("payer")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        payerType: input.payerType,
        initPerfYr: parseInt(input.initPerfYr),
        initPerfMo: parseInt(input.initPerfMo),
        cmsId: input.cmsId,
        marketingName: input.marketingName,
        legalName: input.legalName,
        referenceName: input.referenceName,
        taxId: input.taxId,
        parentOrgName: input.parentOrgName,
        websiteUrl: input.websiteUrl,
      })
      .execute();

    return { success: true };
  });
}
