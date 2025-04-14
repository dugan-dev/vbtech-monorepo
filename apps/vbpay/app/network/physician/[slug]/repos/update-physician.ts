import "server-only";

import { db } from "@workspace/db/database";

import { EditPhysicianFormOutput } from "../components/info/edit-physician-form/edit-physician-form-schema";

type props = {
  input: EditPhysicianFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a physician's record and logs the previous state to a history table within a single transaction.
 *
 * Before updating, the current physician data is archived in the `networkPhysicianHist` table with a timestamp. The main `networkPhysician` record is then updated with new values and audit information.
 *
 * @param input - The updated physician data.
 * @param pubId - The public identifier of the physician to update.
 * @param userId - The identifier of the user performing the update.
 * @returns The result of the update operation.
 */
export function updatePhysician({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
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
            "isActive",

            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    return trx
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
  });
}
