import "server-only";

import { newPubId } from "@workspace/ui/lib/nanoid";
import { db } from "@workspace/vbcall-db/database";

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

    const healthPlanPbps = await trx
      .selectFrom("healthPlanPbp")
      .select(["pubId", "pbpId", "pbpName", "isActive"])
      .where("hpPubId", "=", pubId)
      .execute();

    // new pbps won't have a pubId
    const newPbps = input.pbps.filter((pbp) => pbp.pbpPubId === "");

    // compare existing from db with existing from input and return any that changed
    const changedPbps = input.pbps
      .filter((pbp) => pbp.pbpPubId !== "")
      .filter((inputPbp) => {
        const existingPbp = healthPlanPbps.find(
          (dbPbp) => dbPbp.pubId === inputPbp.pbpPubId,
        );

        if (!existingPbp) return false;

        // Check if any properties have changed
        return (
          existingPbp.pbpId !== inputPbp.pbpId ||
          existingPbp.pbpName !== inputPbp.pbpName ||
          (existingPbp.isActive === 1) !== inputPbp.isActive
        );
      });

    // Insert history records for changed PBPs
    if (changedPbps.length > 0) {
      await Promise.all(
        changedPbps.map((pbp) =>
          trx
            .insertInto("healthPlanPbpHist")
            .columns([
              "pubId",
              "hpPubId",
              "pbpId",
              "pbpName",
              "isActive",
              "createdAt",
              "createdBy",
              "updatedAt",
              "updatedBy",
              "histAddedAt",
            ])
            .expression((eb) =>
              eb
                .selectFrom("healthPlanPbp")
                .select([
                  "pubId",
                  "hpPubId",
                  "pbpId",
                  "pbpName",
                  "isActive",
                  "createdAt",
                  "createdBy",
                  "updatedAt",
                  "updatedBy",
                  eb.val(now).as("histAddedAt"),
                ])
                .where("pubId", "=", pbp.pbpPubId),
            )
            .execute(),
        ),
      );

      // Update changed PBPs
      await Promise.all(
        changedPbps.map((pbp) =>
          trx
            .updateTable("healthPlanPbp")
            .set({
              pbpId: pbp.pbpId,
              pbpName: pbp.pbpName,
              isActive: pbp.isActive ? 1 : 0,
              updatedAt: now,
              updatedBy: userId,
            })
            .where("pubId", "=", pbp.pbpPubId)
            .execute(),
        ),
      );
    }

    // Insert new PBPs
    if (newPbps.length > 0) {
      await trx
        .insertInto("healthPlanPbp")
        .values(
          newPbps.map((pbp) => ({
            pubId: newPubId(),
            hpPubId: pubId,
            pbpId: pbp.pbpId,
            pbpName: pbp.pbpName,
            isActive: pbp.isActive ? 1 : 0,
            createdAt: now,
            createdBy: userId,
            updatedAt: now,
            updatedBy: userId,
          })),
        )
        .execute();
    }

    // Check for PBPs that were in DB but not in input - these should be deactivated, not deleted
    const existingPbpIds = healthPlanPbps.map((pbp) => pbp.pubId);
    const inputPbpIds = input.pbps
      .filter((pbp) => pbp.pbpPubId !== "")
      .map((pbp) => pbp.pbpPubId);

    const missingPbpIds = existingPbpIds.filter(
      (id) => !inputPbpIds.includes(id),
    );

    // If any PBPs were missing from input, deactivate them (don't delete)
    if (missingPbpIds.length > 0) {
      // First add to history table
      await Promise.all(
        missingPbpIds.map((pbpId) =>
          trx
            .insertInto("healthPlanPbpHist")
            .columns([
              "pubId",
              "hpPubId",
              "pbpId",
              "pbpName",
              "isActive",
              "createdAt",
              "createdBy",
              "updatedAt",
              "updatedBy",
              "histAddedAt",
            ])
            .expression((eb) =>
              eb
                .selectFrom("healthPlanPbp")
                .select([
                  "pubId",
                  "hpPubId",
                  "pbpId",
                  "pbpName",
                  "isActive",
                  "createdAt",
                  "createdBy",
                  "updatedAt",
                  "updatedBy",
                  eb.val(now).as("histAddedAt"),
                ])
                .where("pubId", "=", pbpId),
            )
            .execute(),
        ),
      );

      // Deactivate missing PBPs instead of deleting them
      await Promise.all(
        missingPbpIds.map((pbpId) =>
          trx
            .updateTable("healthPlanPbp")
            .set({
              isActive: 0, // Set to inactive
              updatedAt: now,
              updatedBy: userId,
            })
            .where("pubId", "=", pbpId)
            .execute(),
        ),
      );
    }

    return { success: true };
  });
}
