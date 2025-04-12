import "server-only";

import { db } from "@workspace/db/database";

import { EditEntityFormOutput } from "../components/info/edit-entity-form/edit-entity-form-schema";

type props = {
  input: EditEntityFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates an existing network entity while logging its previous state.
 *
 * This function initiates a database transaction that first records the current state of the entity
 * in the history table ("networkEntityHist") and then updates the entity in the main table ("networkEntity")
 * with new values provided in the input. The operations are executed atomically, ensuring consistency
 * by rolling back the transaction if any step fails.
 *
 * @param input - The new details for the entity.
 * @param pubId - The public identifier of the entity to update.
 * @param userId - The identifier of the user performing the update.
 *
 * @returns A promise that resolves when the update operation is complete.
 */
export function updateEntity({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
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

    return trx
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
  });
}
