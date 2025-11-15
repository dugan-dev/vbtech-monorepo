import "server-only";

import { db } from "@workspace/vbum-db/database";

import { PhysicianFormOutput } from "../components/physician-form/physician-form-schema";

type props = {
  input: PhysicianFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Inserts a new physician record into the database after checking for duplicates within a transaction.
 *
 * Checks for existing physicians with the same name and aborts the operation if duplicates are found.
 *
 * @param input - The physician data to insert.
 * @param pubId - The public identifier associated with the physician.
 * @param userId - The identifier of the user performing the operation.
 * @returns An object indicating successful insertion.
 *
 * @throws {Error} If a physician with the same name already exists.
 */
export async function insertPhysician({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const duplicateResults = await trx
      .selectFrom("physician")
      .select("name")
      .where("name", "=", input.name)
      .executeTakeFirst();

    if (duplicateResults?.name) {
      throw new Error(
        `Duplicate Physician found with the same: Name. Please update the information and try again.`,
      );
    }

    const now = new Date();

    await trx
      .insertInto("physician")
      .values({
        pubId,
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
        name: input.name,
        clients: input.clients.join(","),
        notes: input.notes,
        isActive: 1,
        rateReview: input.rateReview.toString(),
        rateDenyWithdrawal: input.rateDenyWithdraw.toString(),
        rateP2p: input.rateP2p.toString(),
      })
      .execute();

    return { success: true };
  });
}
