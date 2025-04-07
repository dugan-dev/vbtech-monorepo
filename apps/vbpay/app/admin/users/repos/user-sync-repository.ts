import { db } from "@workspace/db/database";

import { insertUser } from "./insert-user";
import { updateUser } from "./update-user";
import { getAllUsers } from "./user-management-repository";

/**
 * Synchronizes user data between the Cognito user pool and the SQL database.
 *
 * This function retrieves users from both Cognito and the SQL database to identify discrepancies. For each Cognito user,
 * it inserts a new record if the user does not exist in the database or updates the record if key attributes (email,
 * first name, or last name) differ. After processing all users, it updates or creates the synchronization timestamp for
 * the "VBPay" application in the userSyncTimestamp table using an atomic transaction.
 *
 * @param userId - The identifier of the user initiating the synchronization process.
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
  return db.transaction().execute(async (trx) => {
    const now = new Date();
    const existingTimestamp = await trx
      .selectFrom("userSyncTimestamp")
      .select(["lastSyncAt"])
      .where("appName", "=", "VBPay")
      .executeTakeFirst();

    if (existingTimestamp) {
      trx
        .updateTable("userSyncTimestamp")
        .set({
          lastSyncAt: now,
        })
        .where("appName", "=", "VBPay")
        .execute();
    } else {
      trx
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
 * Retrieves the last synchronization timestamp for the VBPay application.
 *
 * This function queries the "userSyncTimestamp" table for the record where the application name is "VBPay" and returns the first match, which contains the `lastSyncAt` field. If no record is found, it returns undefined.
 *
 * @returns A promise that resolves to the sync timestamp record with the `lastSyncAt` field, or undefined if no record exists.
 */
export function getLastUserSync() {
  return db
    .selectFrom("userSyncTimestamp")
    .select(["lastSyncAt"])
    .where("appName", "=", "VBPay")
    .executeTakeFirst();
}
