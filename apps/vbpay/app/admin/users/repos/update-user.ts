import "server-only";

import { db } from "@workspace/db/database";

type props = {
  userId: string;
  usersUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/**
 * Updates a user's record and logs the prior state in the history table.
 *
 * This function performs an atomic database transaction that first archives the current state 
 * of the user (by inserting their details into the "userHist" table) and then updates the user's 
 * record in the "user" table with the provided email, first name, and last name. If any operation 
 * within the transaction fails, all changes are rolled back.
 *
 * @param userId - Identifier of the user performing the update.
 * @param usersUserId - Identifier of the user whose record is being updated.
 * @param email - New email address.
 * @param firstName - Updated first name.
 * @param lastName - Updated last name.
 *
 * @returns A promise resolving with the result of the update transaction.
 */
export function updateUser({
  userId,
  usersUserId,
  email,
  firstName,
  lastName,
}: props) {
  const now = new Date();

  return db.transaction().execute(async (trx) => {
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
      ])
      .expression((eb) =>
        eb
          .selectFrom("user")
          .select([
            "userId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "email",
            "firstName",
            "lastName",
          ])
          .where("userId", "=", usersUserId),
      )
      .execute();

    return trx
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
  });
}
