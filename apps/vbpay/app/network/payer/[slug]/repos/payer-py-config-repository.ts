import { db } from "@workspace/db/database";

import "server-only";

import { PayerPyConfigFormOutput } from "../components/py-config/payer-py-config-form-schema";

/**
 * Retrieves a payer's performance year configuration.
 *
 * This function queries the "payerPerfYearConfig" table and returns the first record that matches
 * the provided payer public identifier and performance year. The input performance year is parsed
 * as an integer before being used in the query.
 *
 * @param payerPubId - The public identifier of the payer.
 * @param perfYear - The performance year as a string, which will be converted to a number.
 *
 * @returns The matching configuration record, or undefined if no record is found.
 */
export function getPayerPyConfig(payerPubId: string, perfYear: string) {
  return db
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
 * Inserts a new payer performance year configuration record into the database.
 *
 * This function takes configuration data and metadata, including form data, user and payer identifiers,
 * and records a new entry with current timestamps. The performance year is parsed into a number, and
 * physician assignment details are conditionally included based on whether assignment is required.
 *
 * @param formData - Contains basic performance year configuration and physician assignment settings.
 * @param userId - Identifier of the user performing the operation.
 * @param payerPubId - Public identifier of the payer.
 * @param pubId - Publication identifier associated with the configuration.
 * @returns A promise that resolves with the result of the insertion operation.
 */
export function insertPayerPyConfig(
  formData: PayerPyConfigFormOutput,
  userId: string,
  payerPubId: string,
  pubId: string,
) {
  const now = new Date();
  return db
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
 * Updates a payer performance year configuration record.
 *
 * This function logs the current configuration in a history table before applying the update. It sets new configuration values such as performance year, program, type, risk option, payment model, eligibility source, and physician assignment details, applying conditional logic for physician assignments.
 *
 * @param formData - Object containing updated configuration and physician assignment details.
 * @param userId - Identifier of the user performing the update.
 * @param pubId - Publication ID that uniquely identifies the configuration record to update.
 *
 * @returns A promise that resolves when the update operation completes.
 */
export async function updatePayerPyConfig(
  formData: PayerPyConfigFormOutput,
  userId: string,
  pubId: string,
) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
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
    return trx
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
  });
}
