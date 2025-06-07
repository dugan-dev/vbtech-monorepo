import "server-only";

import { db } from "@workspace/vbcall-db/database";

import { ClientFormOutput } from "../components/client-form/client-form-schema";

type props = {
  input: ClientFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a client's information and archives the previous state in a history table within a single transaction.
 *
 * Archives the current client record in the `clientHist` table before applying updates to the `client` table for the specified {@link pubId}.
 *
 * @param input - New client data to apply.
 * @param pubId - Identifier of the client to update.
 * @param userId - Identifier of the user performing the update.
 * @returns The result of the update operation on the `client` table.
 */
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
