import "server-only";

import { db } from "@workspace/vbcall-db/database";

import { newPubId } from "@/lib/nanoid";

import { HealthPlanFormOutput } from "../components/health-plan-form/health-plan-form-schema";

// Define a type that only includes fields that exist in the database table
type HealthPlanDbFields = Pick<
  HealthPlanFormOutput,
  "planName" | "planId" | "phoneNumber" | "faxNumber"
>;

type DuplicateCheck = {
  value: string | undefined;
  field: keyof HealthPlanDbFields;
  displayName: string;
};

type props = {
  input: HealthPlanFormOutput;
  pubId: string;
  clientPubId: string;
  userId: string;
};

/**
 * Creates a new health plan and its associated Plan Benefit Package (PBP) records in the database within a single transaction.
 *
 * Checks for existing health plans with the same name or ID for the specified client and aborts the operation if duplicates are found. On success, inserts the health plan and all related PBPs with relevant metadata.
 *
 * @param input - The health plan form data, including PBPs to associate.
 * @param pubId - The public identifier for the new health plan.
 * @param clientPubId - The public identifier for the client.
 * @param userId - The identifier of the user performing the operation.
 * @returns An object indicating successful completion.
 *
 * @throws {Error} If a health plan with the same name or ID already exists for the client.
 * @throws {Error} If an unsupported field is encountered during duplicate checks.
 */
export async function insertHealthPlan({
  input,
  pubId,
  userId,
  clientPubId,
}: props) {
  return await db.transaction().execute(async (trx) => {
    const duplicateChecks: DuplicateCheck[] = [
      {
        value: input.planName,
        field: "planName",
        displayName: "Health Plan Name",
      },
      {
        value: input.planId,
        field: "planId",
        displayName: "Health Plan ID",
      },
    ];

    const duplicateResults = await Promise.all(
      duplicateChecks
        .filter((check) => check.value !== undefined)
        .map(({ field, value }) => {
          // Use a type-safe approach to select the field
          const query = trx.selectFrom("healthPlan");

          // Add the specific field to select based on the field name
          if (field === "planName") {
            return query
              .select(["planName"])
              .where("planName", "=", value!)
              .where("clientPubId", "=", clientPubId)
              .executeTakeFirst();
          } else if (field === "planId") {
            return query
              .select(["planId"])
              .where("planId", "=", value!)
              .where("clientPubId", "=", clientPubId)
              .executeTakeFirst();
          } else if (field === "phoneNumber") {
            return query
              .select(["phoneNumber"])
              .where("phoneNumber", "=", value!)
              .where("clientPubId", "=", clientPubId)
              .executeTakeFirst();
          } else if (field === "faxNumber") {
            return query
              .select(["faxNumber"])
              .where("faxNumber", "=", value!)
              .where("clientPubId", "=", clientPubId)
              .executeTakeFirst();
          }

          // This should never happen due to the type constraints
          throw new Error(`Unsupported field: ${field}`);
        }),
    );

    const duplicateFields = duplicateChecks
      .filter((_, index) => duplicateResults[index])
      .map((check) => check.displayName);

    if (duplicateFields.length > 0) {
      throw new Error(
        `Duplicate Health Plan found with the same: ${duplicateFields.join(", ")}. Please update the information and try again.`,
      );
    }

    const now = new Date();

    await trx
      .insertInto("healthPlan")
      .values({
        pubId,
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
        clientPubId,
        planName: input.planName,
        planId: input.planId,
        phoneNumber: input.phoneNumber,
        faxNumber: input.faxNumber,
        isActive: 1,
      })
      .execute();

    await trx
      .insertInto("healthPlanPbp")
      .values(
        input.pbps.map((pbp) => ({
          hpPubId: pubId,
          pubId: newPubId(),
          pbpId: pbp.pbpId,
          pbpName: pbp.pbpName,
          createdBy: userId,
          createdAt: now,
          updatedBy: userId,
          updatedAt: now,
        })),
      )
      .execute();

    return { success: true };
  });
}
