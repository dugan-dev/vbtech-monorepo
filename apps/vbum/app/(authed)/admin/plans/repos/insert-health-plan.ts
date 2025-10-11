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
 * Inserts a new health plan for a client after verifying no existing plan has the same name.
 *
 * Performs a transactional duplicate check for `planName` scoped to `clientPubId`, inserts the new `healthPlan` record with audit metadata, and returns success on completion.
 *
 * @param input - Health plan form data; must include `planName`
 * @param pubId - The public identifier to assign to the new health plan
 * @param clientPubId - The client's public identifier used to scope duplicate checks
 * @param userId - Identifier of the user creating the record (stored as creator/updater)
 * @returns An object with `success: true` when the insert completes
 *
 * @throws {Error} If a health plan with the same name already exists for the client.
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
