import "server-only";

import { db } from "@workspace/vbcall-db/database";

import { newPubId } from "@/lib/nanoid";

import { HealthPlanFormOutput } from "../components/health-plan-form/health-plan-form-schema";

type props = {
  input: HealthPlanFormOutput;
  pubId: string;
  userId: string;
};

export function updateHealthPlan({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
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

    trx
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
