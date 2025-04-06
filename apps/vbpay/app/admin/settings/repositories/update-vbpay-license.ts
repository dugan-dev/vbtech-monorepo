import "server-only";

import { VBPayLicense } from "@/repos/license-repository";

import { db } from "@workspace/db/database";

export async function updateVBPayLicense({
  license,
  userId,
}: {
  license: VBPayLicense;
  userId: string;
}) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("vbpayLicenseHist")
      .columns([
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "type",
        "fromDate",
        "toDate",
        "clientName",
        "pocName",
        "pocPhone",
        "pocEmail",
        "numPayers",
        "paymentTypes",
        "functionality",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("vbpayLicense")
          .select([
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "type",
            "fromDate",
            "toDate",
            "clientName",
            "pocName",
            "pocPhone",
            "pocEmail",
            "numPayers",
            "paymentTypes",
            "functionality",
            eb.val(new Date()).as("histAddedAt"),
          ]),
      )
      .execute();

    return trx
      .updateTable("vbpayLicense")
      .set({
        ...license,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();
  });
}
