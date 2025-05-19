import { db } from "@workspace/vbcall-db/database";

import { insertUser } from "./insert-user";
import { updateUser } from "./update-user";
import { getAllUsers } from "./user-management-repository";

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
      .where("appName", "=", "VBCall")
      .executeTakeFirst();

    if (existingTimestamp) {
      trx
        .updateTable("userSyncTimestamp")
        .set({
          lastSyncAt: now,
        })
        .where("appName", "=", "VBCall")
        .execute();
    } else {
      trx
        .insertInto("userSyncTimestamp")
        .values({
          appName: "VBCall",
          lastSyncAt: now,
        })
        .execute();
    }
  });
}

export function getLastUserSync() {
  return db
    .selectFrom("userSyncTimestamp")
    .select(["lastSyncAt"])
    .where("appName", "=", "VBCall")
    .executeTakeFirst();
}
