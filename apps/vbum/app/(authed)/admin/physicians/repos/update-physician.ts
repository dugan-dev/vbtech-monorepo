import "server-only";

import { db } from "@workspace/vbum-db/database";

import { PhysicianFormOutput } from "../components/physician-form/physician-form-schema";

type props = {
  input: PhysicianFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a physician's information and archives the previous state in a history table within a single transaction.
 *
 * The current physician record is first copied to the `physicianHist` table with a timestamp, then the `physician` table is updated with new data for the specified {@link pubId}. Both operations are performed atomically.
 *
 * @param input - New client data to apply.
 * @param pubId - Identifier of the physician to update.
 * @param userId - Identifier of the user performing the update.
 * @returns An object indicating the update was successful.
 */
export async function updatePhysician({ input, pubId, userId }: props) {
  await db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("physicianHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "name",
        "clients",
        "rateReview",
        "rateDenyWithdrawal",
        "rateP2p",
        "notes",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("physician")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "name",
            "clients",
            "rateReview",
            "rateDenyWithdrawal",
            "rateP2p",
            "notes",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    await trx
      .updateTable("physician")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        name: input.name,
        clients: input.clients.join(","),
        rateReview: input.rateReview.toString(),
        rateDenyWithdrawal: input.rateDenyWithdraw.toString(),
        rateP2p: input.rateP2p.toString(),
        notes: input.notes,
        isActive: input.isActive ? 1 : 0,
      })
      .where("pubId", "=", pubId)
      .execute();

    return { success: true };
  });
}
