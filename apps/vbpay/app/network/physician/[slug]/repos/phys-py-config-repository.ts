import { db } from "@workspace/db/database";

import "server-only";

import { PhysPyConfigFormOutput } from "../components/py-config/phys-py-config-form-schema";

/**
 * Retrieves a physician performance year configuration by physician public ID and performance year.
 *
 * @param physPubId - The public identifier of the physician.
 * @param perfYear - The performance year as a string.
 * @returns The configuration record if found; otherwise, undefined.
 */
export function getPhysPyConfig(physPubId: string, perfYear: string) {
  console.log("getPhysPyConfig", physPubId, perfYear);
  return db
    .selectFrom("physPerfYearConfig")
    .select([
      "pubId",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "physPubId",
      "perfYear",
      "enableCapPayments",
      "enableClaimPayments",
      "enableValuePayments",
    ])
    .where("physPubId", "=", physPubId)
    .where("perfYear", "=", parseInt(perfYear))
    .executeTakeFirst();
}

/**
 * Inserts a new physician performance year configuration record into the database.
 *
 * @param formData - Form data containing configuration values, including payment enablement flags and performance year.
 * @param userId - The identifier of the user performing the operation.
 * @param physPubId - The public identifier of the physician.
 * @param pubId - The public identifier for the new configuration record.
 * @returns A promise resolving to the result of the insert operation.
 */
export function insertPhysPyConfig(
  formData: PhysPyConfigFormOutput,
  userId: string,
  physPubId: string,
  pubId: string,
) {
  const now = new Date();
  return db
    .insertInto("physPerfYearConfig")
    .columns([
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "physPubId",
      "perfYear",
      "enableCapPayments",
      "enableClaimPayments",
      "enableValuePayments",
    ])
    .values({
      physPubId,
      pubId,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      perfYear: parseInt(formData.perfYear),
      enableCapPayments: formData.enableCapPayments === true ? 1 : 0,
      enableClaimPayments: formData.enableClaimPayments === true ? 1 : 0,
      enableValuePayments: formData.enableValuePayments === true ? 1 : 0,
    })
    .execute();
}

/**
 * Updates a physician performance year configuration and archives the previous state.
 *
 * Archives the current configuration record identified by {@link pubId} into the history table before applying updates from {@link formData}. Updates include performance year and payment enablement flags, along with audit fields.
 *
 * @param formData - New configuration values to apply.
 * @param userId - Identifier of the user performing the update.
 * @param pubId - Public identifier of the configuration record to update.
 * @returns The result of the update operation.
 */
export async function updatePhysPyConfig(
  formData: PhysPyConfigFormOutput,
  userId: string,
  pubId: string,
) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("physPerfYearConfigHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "physPubId",
        "perfYear",
        "enableCapPayments",
        "enableClaimPayments",
        "enableValuePayments",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("physPerfYearConfig")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "physPubId",
            "perfYear",
            "enableCapPayments",
            "enableClaimPayments",
            "enableValuePayments",
            eb.val(now).as("histAddedAt"),
          ]),
      )
      .execute();

    // update existing
    return trx
      .updateTable("physPerfYearConfig")
      .set({
        updatedAt: now,
        updatedBy: userId,
        perfYear: parseInt(formData.perfYear),
        enableCapPayments: formData.enableCapPayments === true ? 1 : 0,
        enableClaimPayments: formData.enableClaimPayments === true ? 1 : 0,
        enableValuePayments: formData.enableValuePayments === true ? 1 : 0,
      })
      .where("pubId", "=", pubId)
      .execute();
  });
}
