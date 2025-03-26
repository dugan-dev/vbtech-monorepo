import "server-only";

import { db } from "@workspace/db/database";

type props = {
  userId: string;
  newUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/**
 * Inserts a new user record into the database.
 *
 * This function creates a new entry in the "user" table using the provided user details. The new record assigns
 * the new user ID to the user's primary key, sets the email, first name, and last name, and populates the metadata
 * fields (createdBy, createdAt, updatedBy, updatedAt) with the provided user ID and the current timestamp.
 *
 * @param input - An object containing:
 *   - userId: The ID of the user performing the insertion.
 *   - newUserId: The unique ID for the new user record.
 *   - email: The email address of the new user.
 *   - firstName: The first name of the new user.
 *   - lastName: The last name of the new user.
 *
 * @returns The result of the database insert operation.
 */
export function insertUser({
  userId,
  newUserId,
  email,
  firstName,
  lastName,
}: props) {
  const now = new Date();

  return db
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
}
