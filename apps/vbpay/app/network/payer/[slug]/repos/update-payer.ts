import "server-only";

import { db } from "@workspace/db/database";

import { EditPayerFormOutput } from "../components/info/edit-payer-form/edit-payer-form-schema";

type props = {
  input: EditPayerFormOutput;
  pubId: string;
  userId: string;
};

export function updatePayer({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
    const now = new Date();

    // log existing to hist table
    await trx
      .insertInto("payerHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "payerType",
        "initPerfYr",
        "initPerfMo",
        "cmsId",
        "marketingName",
        "legalName",
        "referenceName",
        "taxId",
        "parentOrgName",
        "websiteUrl",
        "isActive",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("payer")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "payerType",
            "initPerfYr",
            "initPerfMo",
            "cmsId",
            "marketingName",
            "legalName",
            "referenceName",
            "taxId",
            "parentOrgName",
            "websiteUrl",
            "isActive",
            eb.val(now).as("histAddedAt"),
          ])
          .where("pubId", "=", pubId),
      )
      .execute();

    return trx
      .updateTable("payer")
      .set({
        pubId,
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
      })
      .execute();
  });
}
