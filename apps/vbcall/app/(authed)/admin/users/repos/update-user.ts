import "server-only";

import { db } from "@workspace/vbcall-db/database";

type props = {
  userId: string;
  usersUserId: string;
  email: string;
  firstName: string;
  lastName: string;
};

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
