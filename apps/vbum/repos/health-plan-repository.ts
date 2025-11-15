import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

async function getAllActiveHealthPlansQry() {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select(["hp.pubId", "hp.clientPubId", "hp.planName"])
    .where("hp.isActive", "=", 1)
    .where("c.isActive", "=", 1)
    .execute();
}

export const getAllActiveHealthPlans = cache(async () => {
  return getAllActiveHealthPlansQry();
});

async function getAllHealthPlansQry() {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select([
      "hp.pubId",
      "hp.clientPubId",
      "c.clientName",
      "hp.planName",
      "hp.isActive",
    ])
    .execute();
}

export const getAllHealthPlans = cache(async () => {
  return getAllHealthPlansQry();
});
