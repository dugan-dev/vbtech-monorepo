import "server-only";

import { db } from "@workspace/db/database";

import { EditEntityFormOutput } from "../components/info/edit-entity-form/edit-entity-form-schema";

type props = {
  input: EditEntityFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a network entity record and archives its previous state in a history table within a single transaction.
 *
 * Before updating, the current entity data is copied to the `networkEntityHist` table with a timestamp. The entity is then updated with new values and metadata.
 *
 * @param input - New values for the entity fields.
 * @param pubId - Public identifier of the entity to update.
 * @param userId - Identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 */
export async function updateEntity({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("networkEntityHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "netEntType",
        "payerPubId",
        "marketingName",
        "legalName",
        "referenceName",
        "orgNpi",
        "taxId",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("networkEntity")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "netEntType",
            "payerPubId",
            "marketingName",
            "legalName",
            "referenceName",
            "orgNpi",
            "taxId",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    await trx
      .updateTable("networkEntity")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        netEntType: input.netEntType,
        marketingName: input.marketingName,
        legalName: input.legalName,
        referenceName: input.referenceName,
        orgNpi: input.orgNpi,
        taxId: input.taxId,
      })
      .execute();

    return { success: true };
  });
}
