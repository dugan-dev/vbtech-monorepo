import "server-only";

import { db } from "@workspace/vbum-db/database";

import { HealthPlanFormOutput } from "../components/health-plan-form/health-plan-form-schema";

type props = {
  input: HealthPlanFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Update a health plan and archive its prior state in the history table.
 *
 * All modifications are applied within a single database transaction so that either all changes succeed or none are committed.
 *
 * @param input - The updated health plan data (includes `planName` and any Plan Benefit Package data when present)
 * @param pubId - The public identifier of the health plan to update
 * @param userId - The identifier of the user performing the update
 * @returns An object with `success: true` if the update completed successfully
 */
export async function updateHealthPlan({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("healthPlanHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "clientPubId",
        "planName",
        "tatStandard",
        "tatExpedited",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("healthPlan")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "clientPubId",
            "planName",
            "tatStandard",
            "tatExpedited",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    await trx
      .updateTable("healthPlan")
      .set({
        pubId,
        updatedBy: userId,
        updatedAt: now,
        planName: input.planName,
        tatStandard: input.tatStandard
          ? Number.parseInt(input.tatStandard, 10)
          : 0,
        tatExpedited: input.tatExpedited
          ? Number.parseInt(input.tatExpedited, 10)
          : 0,
      })
      .where("pubId", "=", pubId)
      .execute();

    return { success: true };
  });
}
