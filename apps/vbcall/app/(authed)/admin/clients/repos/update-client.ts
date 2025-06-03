import "server-only";

import { db } from "@workspace/vbcall-db/database";

import { ClientFormOutput } from "../components/client-form/client-form-schema";

type props = {
  input: ClientFormOutput;
  pubId: string;
  userId: string;
};

export function updateClient({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("clientHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "clientName",
        "clientCode",
        "timezone",
        "description",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("client")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "clientName",
            "clientCode",
            "timezone",
            "description",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    return trx
      .updateTable("client")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        clientName: input.clientName,
        clientCode: input.clientCode,
        timezone: input.timezone,
        description: input.description,
      })
      .where("pubId", "=", pubId)
      .execute();
  });
}
