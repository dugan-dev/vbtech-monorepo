import "server-only";

import { db } from "@workspace/db/database";

import { EditPhysicianFormOutput } from "../components/info/edit-physician-form/edit-physician-form-schema";

type props = {
  input: EditPhysicianFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a physician's record and logs the previous state to a history table within a database transaction.
 *
 * The function archives the current physician data before applying updates, ensuring historical changes are preserved.
 *
 * @param input - The updated physician data.
 * @param pubId - The unique identifier of the physician to update.
 * @param userId - The identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 */
export async function updatePhysician({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("networkPhysicianHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "payerPubId",
        "taxId",
        "npi",
        "orgNpi",
        "firstName",
        "lastName",
        "type",
        "class",
        "soleProprietor",
        "primaryTaxonomyCode",
        "specialty",
        "credential",
        "isActive",
        "poNetEntPubId",
        "faclNetEntPubId",
        "pracNetEntPubId",
        "vendorNetEntPubId",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("networkPhysician")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "payerPubId",
            "taxId",
            "npi",
            "orgNpi",
            "firstName",
            "lastName",
            "type",
            "class",
            "soleProprietor",
            "primaryTaxonomyCode",
            "specialty",
            "credential",
            "poNetEntPubId",
            "faclNetEntPubId",
            "pracNetEntPubId",
            "vendorNetEntPubId",
            "isActive",

            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    await trx
      .updateTable("networkPhysician")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        taxId: input.taxId,
        npi: input.npi,
        orgNpi: input.orgNpi,
        firstName: input.firstName,
        lastName: input.lastName,
        type: input.type,
        class: input.class,
        soleProprietor: input.soleProprietor === "yes" ? 1 : 0,
        primaryTaxonomyCode: input.primaryTaxonomyCode,
        specialty: input.specialty,
        credential: input.credential,
      })
      .execute();

    return { success: true };
  });
}
