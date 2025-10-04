import "server-only";

import { db } from "@workspace/vbum-db/database";

import { ClientFormOutput } from "../components/client-form/client-form-schema";

type props = {
  input: ClientFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a client's information and archives the previous state in a history table within a single transaction.
 *
 * The current client record is first copied to the `clientHist` table with a timestamp, then the `client` table is updated with new data for the specified {@link pubId}. Both operations are performed atomically.
 *
 * @param input - New client data to apply.
 * @param pubId - Identifier of the client to update.
 * @param userId - Identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 */
export async function updateClient({ input, pubId, userId }: props) {
  await db.transaction().execute(async (trx) => {
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

    await trx
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

    return { success: true };
  });
}
