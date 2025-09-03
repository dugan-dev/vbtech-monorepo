import { db } from "@workspace/db/database";

import { insertUser } from "./insert-user";
import { updateUser } from "./update-user";
import { getAllUsers } from "./user-management-repository";

/**
 * Synchronizes user records between an external source and the local database, updating or inserting users as needed.
 *
 * For each user in the external source, adds missing users to the local database and updates existing users if their details differ. Updates the synchronization timestamp for the "VBCall" application upon completion.
 *
 * @param userId - The identifier of the user performing the synchronization.
 * @returns An object indicating successful synchronization.
 */
export async function syncUsers(userId: string) {
  const usersCognito = await getAllUsers();

  const usersSql = await db
    .selectFrom("user")
    .select(["userId", "email", "firstName", "lastName"])
    .execute();

  // Add missing users
  for (const userCognito of usersCognito) {
    const userSql = usersSql.find((u) => u.email === userCognito.email);
    if (!userSql) {
      await insertUser({
        userId,
        newUserId: userCognito.userId,
        email: userCognito.email,
        firstName: userCognito.firstName,
        lastName: userCognito.lastName,
      });
    }

    // Update users
    if (userSql) {
      if (
        userSql.email !== userCognito.email ||
        userSql.firstName !== userCognito.firstName ||
        userSql.lastName !== userCognito.lastName
      ) {
        await updateUser({
          userId,
          usersUserId: userSql.userId,
          email: userCognito.email,
          firstName: userCognito.firstName,
          lastName: userCognito.lastName,
        });
      }
    }
  }

  // Insert or update sync timestamp
  return await db.transaction().execute(async (trx) => {
    const now = new Date();
    const existingTimestamp = await trx
      .selectFrom("userSyncTimestamp")
      .select(["lastSyncAt"])
      .where("appName", "=", "VBCall")
      .executeTakeFirst();

    if (existingTimestamp) {
      await trx
        .updateTable("userSyncTimestamp")
        .set({
          lastSyncAt: now,
        })
        .where("appName", "=", "VBCall")
        .execute();
    } else {
      await trx
        .insertInto("userSyncTimestamp")
        .values({
          appName: "VBCall",
          lastSyncAt: now,
        })
        .execute();
    }

    return { success: true };
  });
}

/**
 * Retrieves the most recent user synchronization timestamp for the "VBCall" application.
 *
 * @returns The latest synchronization record containing the {@link lastSyncAt} timestamp, or undefined if no record exists.
 */
export async function getLastUserSync() {
  return await db
    .selectFrom("userSyncTimestamp")
    .select(["lastSyncAt"])
    .where("appName", "=", "VBCall")
    .executeTakeFirst();
}
