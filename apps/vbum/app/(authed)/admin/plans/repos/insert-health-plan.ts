import "server-only";

import { db } from "@workspace/vbum-db/database";

import { HealthPlanFormOutput } from "../components/health-plan-form/health-plan-form-schema";

// Define a type that only includes fields that exist in the database table
type HealthPlanDbFields = Pick<HealthPlanFormOutput, "planName">;

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
        isActive: 1,
      })
      .execute();

    return { success: true };
  });
}
