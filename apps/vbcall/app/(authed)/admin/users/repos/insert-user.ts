import "server-only";

import { db } from "@workspace/vbcall-db/database";

type props = {
  userId: string;
  newUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/**
 * Inserts a new user record into the database with metadata about the creator and timestamps.
 *
 * @param userId - The ID of the user performing the insertion.
 * @param newUserId - The unique ID to assign to the new user.
 * @param email - The email address of the new user.
 * @param firstName - The first name of the new user.
 * @param lastName - The last name of the new user.
 * @returns An object indicating the operation was successful.
 */
export async function insertUser({
  userId,
  newUserId,
  email,
  firstName,
  lastName,
}: props) {
  const now = new Date();

  await db
    .insertInto("user")
    .values({
      userId: newUserId,
      email,
      firstName,
      lastName,
      createdBy: userId,
      createdAt: now,
      updatedBy: userId,
      updatedAt: now,
    })
    .execute();

  return { success: true };
}
