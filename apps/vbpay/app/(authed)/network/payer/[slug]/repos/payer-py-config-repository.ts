import { db } from "@workspace/db/database";

import "server-only";

import { PayerPyConfigFormOutput } from "../components/py-config/payer-py-config-form-schema";

/**
 * Fetches the configuration for a specific payer and performance year.
 *
 * @param payerPubId - The unique public identifier for the payer.
 * @param perfYear - The performance year to retrieve, as a string.
 * @returns The configuration record if found; otherwise, undefined.
 */
export async function getPayerPyConfig(payerPubId: string, perfYear: string) {
  return await db
    .selectFrom("payerPerfYearConfig")
    .select([
      "pubId",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "payerPubId",
      "perfYear",
      "program",
      "type",
      "riskOption",
      "paymentModel",
      "eligSrc",
      "assignToPhysicians",
      "physAssignSrc",
      "physAssignMethod",
    ])
    .where("payerPubId", "=", payerPubId)
    .where("perfYear", "=", parseInt(perfYear))
    .executeTakeFirst();
}

/**
 * Creates a new payer performance year configuration record in the database.
 *
 * Inserts configuration and assignment details for a payer and performance year, using provided form data and identifiers. Physician assignment fields are included only if assignment is required.
 *
 * @param formData - Configuration and assignment details for the new record.
 * @param userId - ID of the user creating the record.
 * @param payerPubId - Public identifier for the payer.
 * @param pubId - Publication identifier for the configuration.
 * @returns A promise resolving to the result of the database insertion.
 */
export async function insertPayerPyConfig(
  formData: PayerPyConfigFormOutput,
  userId: string,
  payerPubId: string,
  pubId: string,
) {
  const now = new Date();
  return await db
    .insertInto("payerPerfYearConfig")
    .columns([
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "payerPubId",
      "perfYear",
      "program",
      "type",
      "riskOption",
      "paymentModel",
      "eligSrc",
      "assignToPhysicians",
      "physAssignSrc",
      "physAssignMethod",
    ])
    .values({
      payerPubId,
      pubId,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      perfYear: parseInt(formData.basicInfo.perfYear),
      program: formData.basicInfo.program,
      type: formData.basicInfo.type,
      riskOption: formData.basicInfo.riskOption,
      paymentModel: formData.basicInfo.paymentModel,
      eligSrc: formData.basicInfo.eligSource,
      assignToPhysicians: formData.physAssignment.isRequired ? 1 : 0,
      physAssignSrc: formData.physAssignment.isRequired
        ? formData.physAssignment.physAssignSource
        : null,
      physAssignMethod: formData.physAssignment.isRequired
        ? formData.physAssignment.physAssignMethod
        : null,
    })
    .execute();
}

/**
 * Updates an existing payer performance year configuration and logs the previous state to a history table.
 *
 * Archives the current configuration identified by {@link pubId} before applying updates from {@link formData}. Updates include performance year, program details, risk options, payment model, eligibility source, and physician assignment settings.
 *
 * @param formData - Updated configuration and physician assignment details.
 * @param userId - ID of the user performing the update.
 * @param pubId - Unique identifier for the configuration record to update.
 * @returns An object indicating success after the update completes.
 */
export async function updatePayerPyConfig(
  formData: PayerPyConfigFormOutput,
  userId: string,
  pubId: string,
) {
  const now = new Date();
  return await db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("payerPerfYearConfigHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "payerPubId",
        "perfYear",
        "program",
        "type",
        "riskOption",
        "paymentModel",
        "eligSrc",
        "assignToPhysicians",
        "physAssignSrc",
        "physAssignMethod",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("payerPerfYearConfig")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "payerPubId",
            "perfYear",
            "program",
            "type",
            "riskOption",
            "paymentModel",
            "eligSrc",
            "assignToPhysicians",
            "physAssignSrc",
            "physAssignMethod",
            eb.val(now).as("histAddedAt"),
          ]),
      )
      .execute();

    // update existing
    await trx
      .updateTable("payerPerfYearConfig")
      .set({
        updatedAt: now,
        updatedBy: userId,
        perfYear: parseInt(formData.basicInfo.perfYear),
        program: formData.basicInfo.program,
        type: formData.basicInfo.type,
        riskOption: formData.basicInfo.riskOption,
        paymentModel: formData.basicInfo.paymentModel,
        eligSrc: formData.basicInfo.eligSource,
        assignToPhysicians: formData.physAssignment.isRequired ? 1 : 0,
        physAssignSrc: formData.physAssignment.isRequired
          ? formData.physAssignment.physAssignSource
          : null,
        physAssignMethod: formData.physAssignment.isRequired
          ? formData.physAssignment.physAssignMethod
          : null,
      })
      .where("pubId", "=", pubId)
      .execute();

    return { success: true };
  });
}
