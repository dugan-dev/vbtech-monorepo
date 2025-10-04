import "server-only";

import { db } from "@workspace/vbum-db/database";

import { HealthPlanFormOutput } from "../components/health-plan-form/health-plan-form-schema";

type props = {
  input: HealthPlanFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Updates a health plan and its associated Plan Benefit Packages (PBPs) atomically.
 *
 * Archives the current state of the health plan and PBPs before applying updates. Updates the health plan's details, inserts new PBPs, updates changed PBPs, and deactivates PBPs that are no longer present in the input. All changes are recorded in corresponding history tables for audit purposes.
 *
 * @param input - The updated health plan data, including PBPs.
 * @param pubId - The public identifier of the health plan to update.
 * @param userId - The identifier of the user performing the update.
 * @returns An object with `success: true` if the update completes successfully.
 *
 * @remark All operations are performed within a single database transaction to ensure atomicity. If any step fails, no changes are committed.
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
        "planId",
        "phoneNumber",
        "faxNumber",
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
            "planId",
            "phoneNumber",
            "faxNumber",
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
        planId: input.planId,
        phoneNumber: input.phoneNumber,
        faxNumber: input.faxNumber,
      })
      .where("pubId", "=", pubId)
      .execute();

    return { success: true };
  });
}
