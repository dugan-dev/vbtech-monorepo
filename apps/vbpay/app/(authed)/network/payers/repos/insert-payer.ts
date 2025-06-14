import "server-only";

import { ReferenceExpression } from "kysely";

import { db } from "@workspace/db/database";
import { DB } from "@workspace/db/types";

import { AddPayerFormOutput } from "../components/add-payer-form/add-payer-form-schema";

type DuplicateCheck = {
  value: string | undefined;
  field: keyof AddPayerFormOutput;
  displayName: string;
};

type props = {
  input: AddPayerFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Inserts a new payer record into the database, ensuring no duplicate key fields exist for the same payer type.
 *
 * Checks for existing payers with matching marketing name, reference name, tax ID, or CMS ID within the same payer type before insertion. If duplicates are found, the operation is aborted and an error is thrown. On success, creates the payer record with the provided details and metadata.
 *
 * @param input - The payer details to insert.
 * @param pubId - The publication or organization identifier for the payer.
 * @param userId - The identifier of the user performing the insertion.
 * @returns An object indicating successful insertion.
 *
 * @throws {Error} If a payer already exists with the same marketing name, reference name, tax ID, or CMS ID for the given payer type.
 */
export async function insertPayer({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const duplicateChecks: DuplicateCheck[] = [
      {
        value: input.marketingName,
        field: "marketingName",
        displayName: "Marketing Name",
      },
      {
        value: input.referenceName,
        field: "referenceName",
        displayName: "Acronym/Nickname",
      },
      { value: input.taxId, field: "taxId", displayName: "Tax ID" },
      {
        value: input.cmsId,
        field: "cmsId",
        displayName: "CMS ID",
      },
    ];

    const duplicateResults = await Promise.all(
      duplicateChecks
        .filter((check) => check.value !== undefined)
        .map(({ field, value }) =>
          trx
            .selectFrom("payer")
            .select([field])
            .where(field as ReferenceExpression<DB, "payer">, "=", value!)
            .where("payer.payerType", "=", input.payerType)
            .executeTakeFirst(),
        ),
    );

    const duplicateFields = duplicateChecks
      .filter((_, index) => duplicateResults[index])
      .map((check) => check.displayName);

    if (duplicateFields.length > 0) {
      throw new Error(
        `Duplicate Payer found with the same: ${duplicateFields.join(", ")}. Please update the information and try again.`,
      );
    }

    const now = new Date();

    await trx
      .insertInto("payer")
      .values({
        pubId,
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
        payerType: input.payerType,
        initPerfYr: parseInt(input.initPerfYr),
        initPerfMo: parseInt(input.initPerfMo),
        cmsId: input.cmsId,
        marketingName: input.marketingName,
        legalName: input.legalName,
        referenceName: input.referenceName,
        taxId: input.taxId,
        parentOrgName: input.parentOrgName,
        websiteUrl: input.websiteUrl,
        isActive: 1,
      })
      .execute();

    return { success: true };
  });
}
