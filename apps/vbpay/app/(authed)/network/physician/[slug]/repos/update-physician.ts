import "server-only";

import { db } from "@workspace/db/database";

import { EditPhysicianFormOutput } from "../components/info/edit-physician-form/edit-physician-form-schema";

type props = {
  input: EditPhysicianFormOutput;
  pubId: string;
  userId: string;
};

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
