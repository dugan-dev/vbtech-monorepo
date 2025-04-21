import { db } from "@workspace/db/database";

import "server-only";

import { PhysPyConfigFormOutput } from "../components/py-config/phys-py-config-form-schema";

export function getPhysPyConfig(physPubId: string, perfYear: string) {
  console.log("getPhysPyConfig", physPubId, perfYear);
  return db
    .selectFrom("physPerfYearConfig")
    .select([
      "pubId",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "physPubId",
      "perfYear",
      "enableCapPayments",
      "enableClaimPayments",
      "enableValuePayments",
    ])
    .where("physPubId", "=", physPubId)
    .where("perfYear", "=", parseInt(perfYear))
    .executeTakeFirst();
}

export function insertPhysPyConfig(
  formData: PhysPyConfigFormOutput,
  userId: string,
  physPubId: string,
  pubId: string,
) {
  const now = new Date();
  return db
    .insertInto("physPerfYearConfig")
    .columns([
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "physPubId",
      "perfYear",
      "enableCapPayments",
      "enableClaimPayments",
      "enableValuePayments",
    ])
    .values({
      physPubId,
      pubId,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      perfYear: parseInt(formData.perfYear),
      enableCapPayments: formData.enableCapPayments === true ? 1 : 0,
      enableClaimPayments: formData.enableClaimPayments === true ? 1 : 0,
      enableValuePayments: formData.enableValuePayments === true ? 1 : 0,
    })
    .execute();
}

export async function updatePhysPyConfig(
  formData: PhysPyConfigFormOutput,
  userId: string,
  pubId: string,
) {
  const now = new Date();
  return db.transaction().execute(async (trx) => {
    // log existing to hist table
    await trx
      .insertInto("physPerfYearConfigHist")
      .columns([
        "pubId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "physPubId",
        "perfYear",
        "enableCapPayments",
        "enableClaimPayments",
        "enableValuePayments",
        "histAddedAt",
      ])
      .expression((eb) =>
        eb
          .selectFrom("physPerfYearConfig")
          .select([
            "pubId",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "physPubId",
            "perfYear",
            "enableCapPayments",
            "enableClaimPayments",
            "enableValuePayments",
            eb.val(now).as("histAddedAt"),
          ]),
      )
      .execute();

    // update existing
    return trx
      .updateTable("physPerfYearConfig")
      .set({
        updatedAt: now,
        updatedBy: userId,
        perfYear: parseInt(formData.perfYear),
        enableCapPayments: formData.enableCapPayments === true ? 1 : 0,
        enableClaimPayments: formData.enableClaimPayments === true ? 1 : 0,
        enableValuePayments: formData.enableValuePayments === true ? 1 : 0,
      })
      .where("pubId", "=", pubId)
      .execute();
  });
}
