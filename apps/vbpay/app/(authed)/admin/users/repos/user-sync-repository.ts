import { db } from "@workspace/db/database";

import { insertUser } from "./insert-user";
import { updateUser } from "./update-user";
import { getAllUsers } from "./user-management-repository";

/**
 * Synchronizes user records between an external user source and the local database, updating or inserting users as needed.
 *
 * For each user in the external source, adds new users to the local database or updates existing users if their details differ. Updates the synchronization timestamp for the "VBPay" application upon completion.
 *
 * @param userId - The identifier of the user performing the synchronization.
 * @returns A promise that resolves when the synchronization and timestamp update are complete.
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
      .where("appName", "=", "VBPay")
      .executeTakeFirst();

    if (existingTimestamp) {
      await trx
        .updateTable("userSyncTimestamp")
        .set({
          lastSyncAt: now,
        })
        .where("appName", "=", "VBPay")
        .execute();
    } else {
      await trx
        .insertInto("userSyncTimestamp")
        .values({
          appName: "VBPay",
          lastSyncAt: now,
        })
        .execute();
    }
  });
}

/**
 * Retrieves the most recent user synchronization timestamp for the "VBPay" application.
 *
 * @returns An object containing the `lastSyncAt` timestamp if a record exists, or `undefined` if no synchronization has occurred.
 */
export async function getLastUserSync() {
  return await db
    .selectFrom("userSyncTimestamp")
    .select(["lastSyncAt"])
    .where("appName", "=", "VBPay")
    .executeTakeFirst();
}
