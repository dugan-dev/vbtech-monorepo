import "server-only";

import { db } from "@workspace/db/database";

import { EditPayerFormOutput } from "../components/info/edit-payer-form/edit-payer-form-schema";

type props = {
  input: EditPayerFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a payer's record and logs its current state into a history table within an atomic transaction.
 *
 * The function first logs the existing payer data from the main table to the `payerHist` table with a timestamp,
 * then applies the updated details to the payer record. This ensures data changes are auditable and executed atomically.
 *
 * @param input - An object containing updated payer details.
 * @param pubId - The public identifier of the payer to update.
 * @param userId - The identifier of the user performing the update.
 *
 * @returns A promise that resolves when the transaction is complete.
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
