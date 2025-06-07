import "server-only";

import { db } from "@workspace/db/database";

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

  return await db
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
