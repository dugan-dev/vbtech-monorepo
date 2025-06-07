import "server-only";

import { db } from "@workspace/db/database";

import { EditPhysAffiliatesFormOutput } from "../components/affiliates/edit-affiliates-form/edit-phys-affiliates-schema";

type props = {
  input: EditPhysAffiliatesFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates physician affiliate information and records a history snapshot within a database transaction.
 *
 * Captures the current state of the physician record in a history table before updating affiliate-related fields. If `input.noAffiliates` is `true`, all affiliate fields are cleared; otherwise, they are updated with the provided values.
 *
 * @returns An object indicating the update was successful.
 */
export async function updatePhysAffiliates({ input, pubId, userId }: props) {
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
        "poNetEntPubId",
        "faclNetEntPubId",
        "pracNetEntPubId",
        "vendorNetEntPubId",
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
        poNetEntPubId: input.noAffiliates === true ? null : input.poNetEntPubId,
        faclNetEntPubId:
          input.noAffiliates === true ? null : input.faclNetEntPubId,
        pracNetEntPubId:
          input.noAffiliates === true ? null : input.pracNetEntPubId,
        vendorNetEntPubId:
          input.noAffiliates === true ? null : input.vendorNetEntPubId,
      })
      .execute();

    return { success: true };
  });
}
