import "server-only";

import { db } from "@workspace/db/database";

import { EditEntityFormOutput } from "../components/info/edit-entity-form/edit-entity-form-schema";

type props = {
  input: EditEntityFormOutput;
  pubId: string;
  userId: string;
};

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
