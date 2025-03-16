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

export function insertPayer({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
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

    return trx
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
  });
}
