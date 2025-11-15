import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

import { newPubId } from "@/lib/nanoid";
import { CaseFormInput } from "@/components/worklist/case-form-schema";

async function getAllUmCasesQry() {
  return await db
    .selectFrom("umCase as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.updatedAt",
      "um.caseNumber",
      "um.procedureCode",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.mdName",
      "um.p2pSuccess",
      "um.remarks",
    ])
    .execute();
}

export const getAllUmCases = cache(async () => {
  return getAllUmCasesQry();
});

async function getAllUmCasesForUserQry({ assignedTo }: { assignedTo: string }) {
  return await db
    .selectFrom("umCase as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.updatedAt",
      "um.caseNumber",
      "um.procedureCode",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.mdName",
      "um.p2pSuccess",
      "um.remarks",
    ])
    .where("um.assignedTo", "=", assignedTo)
    .execute();
}

export const getAllUmCasesForUser = cache(async (assignedTo: string) => {
  return getAllUmCasesForUserQry({ assignedTo });
});

export async function updateUmCase(
  pubId: string,
  userId: string,
  data: CaseFormInput,
) {
  const now = new Date();
  return await db.transaction().execute(async (trx) => {
    // log history before updating
    await trx
      .insertInto("umCaseHist")
      .columns([
        "histAddedAt",
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "assignedAt",
        "assignedTo",
        "clientPubId",
        "planPubId",
        "status",
        "caseNumber",
        "procedureCode",
        "mdReview",
        "mdName",
        "fuAction",
        "p2pSuccess",
        "remarks",
      ])
      .expression((eb) =>
        eb
          .selectFrom("umCase")
          .select([
            eb.val(now).as("histAddedAt"),
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "assignedAt",
            "assignedTo",
            "clientPubId",
            "planPubId",
            "status",
            "caseNumber",
            "procedureCode",
            "mdReview",
            "mdName",
            "fuAction",
            "p2pSuccess",
            "remarks",
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    // update existing case with new form data
    await trx
      .updateTable("umCase")
      .where("pubId", "=", pubId)
      .set({
        caseNumber: data.caseId,
        clientPubId: data.clientPubId,
        planPubId: data.planPubId,
        procedureCode: data.procedureCode,
        status: data.status,
        fuAction: data.followUpAction,
        p2pSuccess: data.p2pSuccessful === "Yes" ? 1 : 0,
        mdReview: data.escalatedToMD === "Yes" ? 1 : 0,
        mdName: data.mdName,
        remarks: data.remarks,
        updatedBy: userId,
        updatedAt: now,
      })
      .execute();
  });
}

export async function insertUmCase(data: CaseFormInput, userId: string) {
  const now = new Date();
  const pubId = newPubId();
  return await db
    .insertInto("umCase")
    .columns([
      "pubId",
      "assignedAt",
      "assignedTo",
      "clientPubId",
      "planPubId",
      "caseNumber",
      "procedureCode",
      "status",
      "fuAction",
      "p2pSuccess",
      "mdReview",
      "mdName",
      "remarks",
      "createdBy",
      "createdAt",
      "updatedBy",
      "updatedAt",
    ])
    .values({
      pubId,
      assignedAt: now,
      assignedTo: data.assignedTo,
      clientPubId: data.clientPubId,
      planPubId: data.planPubId,
      caseNumber: data.caseId,
      procedureCode: data.procedureCode,
      status: data.status,
      fuAction: data.followUpAction,
      p2pSuccess: data.p2pSuccessful === "Yes" ? 1 : 0,
      mdReview: data.escalatedToMD === "Yes" ? 1 : 0,
      mdName: data.mdName,
      remarks: data.remarks,
      createdBy: userId,
      createdAt: now,
      updatedBy: userId,
      updatedAt: now,
    })
    .execute();
}
