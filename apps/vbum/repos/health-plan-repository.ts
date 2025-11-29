import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieve all active health plans joined with their active clients, ordered by plan name ascending.
 *
 * @returns An array of objects each containing `hp.pubId`, `hp.clientPubId`, `hp.planName`, `hp.tatStandard`, and `hp.tatExpedited`.
 */
async function getAllActiveHealthPlansQry() {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select([
      "hp.pubId",
      "hp.clientPubId",
      "hp.planName",
      "hp.tatStandard",
      "hp.tatExpedited",
    ])
    .where("hp.isActive", "=", 1)
    .where("c.isActive", "=", 1)
    .orderBy("hp.planName", "asc")
    .execute();
}

export const getAllActiveHealthPlans = cache(async () => {
  return getAllActiveHealthPlansQry();
});

/**
 * Retrieve all health plans along with their associated client information.
 *
 * @returns An array of records where each record contains `pubId`, `clientPubId`, `clientName`, `planName`, `tatStandard`, `tatExpedited`, and `isActive`
 */
async function getAllHealthPlansQry() {
  return await db
    .selectFrom("healthPlan as hp")
    .innerJoin("client as c", "hp.clientPubId", "c.pubId")
    .select([
      "hp.pubId",
      "hp.clientPubId",
      "c.clientName",
      "hp.planName",
      "hp.tatStandard",
      "hp.tatExpedited",
      "hp.isActive",
    ])
    .orderBy("hp.planName", "asc")
    .execute();
}

export const getAllHealthPlans = cache(async () => {
  return getAllHealthPlansQry();
});