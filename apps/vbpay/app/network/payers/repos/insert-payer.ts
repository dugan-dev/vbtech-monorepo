import "server-only";

import { ReferenceExpression } from "kysely";

import { db } from "@workspace/db/database";
import { DB } from "@workspace/db/types";

import { newPubId } from "@/lib/nanoid";

type PayerInput = {
  newPubId: string;
  payerType: string;
  initPerfYr: number;
  initPerfMo: number;
  cmsId?: string;
  marketingName: string;
  legalName?: string;
  referenceName?: string;
  taxId?: string;
  parentOrgName?: string;
  websiteUrl?: string;
};

type Payer = {
  pubId: string;
  payerType: string;
  initPerfYr: number;
  initPerfMo: number;
  cmsId: string | null;
  marketingName: string;
  legalName: string | null;
  referenceName: string | null;
  taxId: string | null;
  parentOrgName: string | null;
  websiteUrl: string | null;
  isActive: number;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
};

type DuplicateCheck = {
  value: string | undefined;
  field: keyof Payer;
  displayName: string;
};

type props = {
  input: PayerInput;
  userId: string;
};

export function insertPayer({ input, userId }: props) {
  return db.transaction().execute(async (trx) => {
    const duplicateChecks: DuplicateCheck[] = [
      {
        value: input.marketingName,
        field: "marketingName",
        displayName: "Practice Name",
      },
      {
        value: input.referenceName,
        field: "referenceName",
        displayName: "Acronym/Nickname",
      },
      { value: input.taxId, field: "taxId", displayName: "Tax ID" },
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
        pubId: newPubId(),
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
        payerType: input.payerType,
        initPerfYr: input.initPerfYr,
        initPerfMo: input.initPerfMo,
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
