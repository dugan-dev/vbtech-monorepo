import "server-only";

import { db } from "@workspace/vbcall-db/database";

type props = {
  userId: string;
  usersUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/**
 * Updates a user's information and records the previous state in the user history table within a single transaction.
 *
 * @param userId - The ID of the user performing the update.
 * @param usersUserId - The ID of the user whose information is being updated.
 * @param email - The new email address for the user.
 * @param firstName - The new first name for the user.
 * @param lastName - The new last name for the user.
 * @returns An object indicating the update was successful.
 *
 * @remark Both the user update and the history insertion are performed atomically; if either operation fails, no changes are committed.
 */
export async function updateUser({
  userId,
  usersUserId,
  email,
  firstName,
  lastName,
}: props) {
  const now = new Date();

  return await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("userHist")
      .columns([
        "userId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "email",
        "firstName",
        "lastName",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("user")
          .select((eb) => [
            "userId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "email",
            "firstName",
            "lastName",
            eb.val(now).as("histAddedAt"),
          ])
          .where("userId", "=", usersUserId),
      )
      .execute();

    await trx
      .updateTable("user")
      .set({
        email,
        firstName,
        lastName,
        updatedBy: userId,
        updatedAt: now,
      })
      .where("userId", "=", usersUserId)
      .execute();

    return { success: true };
  });
}
