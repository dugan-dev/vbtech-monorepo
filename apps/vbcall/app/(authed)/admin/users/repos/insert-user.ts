import "server-only";

import { db } from "@workspace/vbcall-db/database";

type props = {
  userId: string;
  newUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

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
