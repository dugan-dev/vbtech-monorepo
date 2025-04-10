import { db } from "@workspace/db/database";

import "server-only";

import { PayerPyConfigFormOutput } from "../components/py-config/payer-py-config-form-schema";

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
