import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

import { formatDateForDb } from "@workspace/utils/format-date-for-db";

import { CaseStatus, ClosedCaseStatuses } from "@/types/case-status";
import { newPubId } from "@/lib/nanoid";
import { CaseFormInput } from "@/components/worklist/case-form-schema";

/**
 * Retrieve all UM cases with related client, health plan, and assigned user details, ordered by received date.
 *
 * @returns An array of UM case records containing: `pubId`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `caseNumber`, `caseType`, `recdDate`, `procedureCodes`, `clientPubId`, `planPubId`, `clientName`, `planName`, `status`, `assignedTo`, `assignedAt`, `assignedToLastName`, `assignedToFirstName`, `assignedToEmail`, `fuAction`, `mdReview`, `physPubId`, `p2pSuccess`, `closedAt`, `mdRecommended`, and `remarks`.
 */
async function getAllUmCasesQry() {
  return await db
    .selectFrom("umCase as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.createdBy",
      "um.updatedAt",
      "um.updatedBy",
      "um.caseNumber",
      "um.caseType",
      "um.recdDate",
      "um.procedureCodes",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "um.assignedAt",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.physPubId",
      "um.p2pSuccess",
      "um.closedAt",
      "um.mdRecommended",
      "um.remarks",
    ])
    .orderBy("um.recdDate", "asc")
    .execute();
}

export const getAllUmCases = cache(async () => {
  return getAllUmCasesQry();
});

/**
 * Retrieve UM cases assigned to a specific user with related client, health plan, and assigned-user details.
 *
 * @param assignedTo - The userId of the assignee used to filter UM cases
 * @returns An array of UM case records including fields from the UM case, client, health plan, and assigned user (e.g., caseNumber, caseType, recdDate, procedureCodes, clientName, planName, assignedTo details, status, closedAt)
 */
async function getAllUmCasesForUserQry({ assignedTo }: { assignedTo: string }) {
  return await db
    .selectFrom("umCase as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.createdBy",
      "um.updatedAt",
      "um.updatedBy",
      "um.caseNumber",
      "um.caseType",
      "um.recdDate",
      "um.procedureCodes",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "um.assignedAt",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.physPubId",
      "um.p2pSuccess",
      "um.mdRecommended",
      "um.closedAt",
      "um.remarks",
    ])
    .where("um.assignedTo", "=", assignedTo)
    .orderBy("um.recdDate", "asc")
    .execute();
}

export const getAllUmCasesForUser = cache(async (assignedTo: string) => {
  return getAllUmCasesForUserQry({ assignedTo });
});

/**
 * Update an existing UM case, record a history snapshot, and apply the provided form changes.
 *
 * Logs the current row into `umCaseHist` with `histAddedAt` set to the update timestamp, then updates
 * the `umCase` row with values from `data`. The update sets `updatedBy`/`updatedAt`, conditionally
 * updates `assignedTo` and `assignedAt` only when the assignee changes, and sets `closedAt` when the
 * new status is in `ClosedCaseStatuses` and a closed date is provided.
 *
 * @param pubId - The public identifier of the UM case to update
 * @param userId - The user id performing the update (stored in `updatedBy`)
 * @param data - Form input containing fields to apply to the UM case
 */
export async function updateUmCase(
  pubId: string,
  userId: string,
  data: CaseFormInput,
) {
  const now = new Date();
  return await db.transaction().execute(async (trx) => {
    // get currently assigned user
    const currentlyAssigned = await trx
      .selectFrom("umCase")
      .select(["assignedTo"])
      .where("pubId", "=", pubId)
      .executeTakeFirst();
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
        "caseType",
        "recdDate",
        "procedureCodes",
        "mdReview",
        "physPubId",
        "fuAction",
        "p2pSuccess",
        "mdRecommended",
        "closedAt",
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
            "caseType",
            "recdDate",
            "procedureCodes",
            "mdReview",
            "physPubId",
            "fuAction",
            "p2pSuccess",
            "mdRecommended",
            "closedAt",
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
        caseType: data.caseType,
        recdDate: formatDateForDb({ date: data.recdDate }),
        clientPubId: data.clientPubId,
        planPubId: data.planPubId,
        procedureCodes: data.procedureCodes.map((code) => code.code).join(","),
        status: data.status,
        fuAction: data.followUpAction,
        p2pSuccess: data.p2pSuccessful === "Yes" ? 1 : 0,
        mdReview: data.escalatedToMD === "Yes" ? 1 : 0,
        mdRecommended: data.mdRecommended,
        physPubId: data.physPubId,
        remarks: data.remarks,
        updatedBy: userId,
        updatedAt: now,
        assignedTo:
          data.assignedTo === currentlyAssigned?.assignedTo
            ? undefined
            : data.assignedTo,
        assignedAt:
          data.assignedTo === currentlyAssigned?.assignedTo ? undefined : now,
        closedAt:
          ClosedCaseStatuses.includes(data.status as CaseStatus) &&
          data.closedDate
            ? formatDateForDb({ date: data.closedDate })
            : undefined,
      })
      .execute();
  });
}

/**
 * Insert a new UM case record into the database.
 *
 * @param data - Form input containing UM case fields to store (case identifiers, client/plan links, dates, status, procedure codes, assignment, physician and MD fields, and remarks)
 * @param userId - ID of the user performing the insert; used as createdBy/updatedBy
 * @returns The result of the insert operation
 */
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
      "caseType",
      "recdDate",
      "closedAt",
      "procedureCodes",
      "status",
      "fuAction",
      "p2pSuccess",
      "mdReview",
      "mdRecommended",
      "physPubId",
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
      caseType: data.caseType,
      recdDate: formatDateForDb({ date: data.recdDate }),
      closedAt:
        ClosedCaseStatuses.includes(data.status as CaseStatus) &&
        data.closedDate
          ? formatDateForDb({ date: data.closedDate })
          : null,
      procedureCodes: data.procedureCodes.map((code) => code.code).join(","),
      status: data.status,
      fuAction: data.followUpAction,
      p2pSuccess: data.p2pSuccessful === "Yes" ? 1 : 0,
      mdReview: data.escalatedToMD === "Yes" ? 1 : 0,
      mdRecommended: data.mdRecommended,
      physPubId: data.physPubId,
      remarks: data.remarks,
      createdBy: userId,
      createdAt: now,
      updatedBy: userId,
      updatedAt: now,
    })
    .execute();
}

/**
 * Fetches a UM case by its case number including related client, health plan, and assigned user details.
 *
 * @param caseNumber - The case number to look up
 * @returns The UM case record with related client, health plan, and assigned user fields, or `undefined` if not found
 */
export async function getUmCaseByCaseNumber(caseNumber: string) {
  return await db
    .selectFrom("umCase as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.createdBy",
      "um.updatedAt",
      "um.updatedBy",
      "um.caseNumber",
      "um.caseType",
      "um.recdDate",
      "um.procedureCodes",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "um.assignedAt",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.physPubId",
      "um.p2pSuccess",
      "um.mdRecommended",
      "um.closedAt",
      "um.remarks",
    ])
    .where("caseNumber", "=", caseNumber)
    .executeTakeFirst();
}

/**
 * Retrieve the history entries for a UM case identified by its case number.
 *
 * @param caseNumber - The case's identifier used in the history table (`umCaseHist.pubId`)
 * @returns An array of history records for the case; each record includes pubId, createdAt, createdBy, updatedBy, updatedAt, updatedByFirstName, updatedByLastName, caseNumber, caseType, recdDate, procedureCodes, clientPubId, planPubId, clientName, planName, status, assignedTo, assignedAt, assignedToFirstName, assignedToLastName, assignedToEmail, fuAction, mdReview, physPubId, p2pSuccess, mdRecommended, closedAt, and remarks
 */
async function getUmCaseHistoryQry(caseNumber: string) {
  return await db
    .selectFrom("umCaseHist as um")
    .innerJoin("client as c", "um.clientPubId", "c.pubId")
    .innerJoin("healthPlan as hp", "um.planPubId", "hp.pubId")
    .leftJoin("user as u", "um.assignedTo", "u.userId")
    .leftJoin("user as u2", "um.updatedBy", "u2.userId")
    .select([
      "um.pubId",
      "um.createdAt",
      "um.createdBy",
      "um.updatedBy",
      "u2.firstName as updatedByFirstName",
      "u2.lastName as updatedByLastName",
      "um.updatedAt",
      "um.caseNumber",
      "um.caseType",
      "um.recdDate",
      "um.procedureCodes",
      "um.clientPubId",
      "um.planPubId",
      "c.clientName",
      "hp.planName",
      "um.status",
      "um.assignedTo",
      "um.assignedAt",
      "u.lastName as assignedToLastName",
      "u.firstName as assignedToFirstName",
      "u.email as assignedToEmail",
      "um.fuAction",
      "um.mdReview",
      "um.physPubId",
      "um.p2pSuccess",
      "um.mdRecommended",
      "um.closedAt",
      "um.remarks",
    ])
    .where("um.pubId", "=", caseNumber)
    .orderBy("um.histAddedAt", "desc")
    .execute();
}

export const getUmCaseHistory = cache(async (caseNumber: string) => {
  return getUmCaseHistoryQry(caseNumber);
});