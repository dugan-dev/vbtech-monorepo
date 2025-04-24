import "server-only";

import { VBPayGlobalSettings } from "@/repos/global-settings-repository";
import { VBPayLicense } from "@/repos/license-repository";
import { Transaction } from "kysely";

import { db } from "@workspace/db/database";
import { DB } from "@workspace/db/types";

function insertLicense({
  license,
  userId,
  trx,
}: {
  license: VBPayLicense;
  userId: string;
  trx: Transaction<DB>;
}) {
  const now = new Date();
  return trx
    .insertInto("vbpayLicense")
    .values({
      ...license,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
    })
    .execute();
}

function insertGlobalSettings({
  globalSettings,
  userId,
  trx,
}: {
  globalSettings: VBPayGlobalSettings;
  userId: string;
  trx: Transaction<DB>;
}) {
  const now = new Date();
  return trx
    .insertInto("vbpayGlobalSettings")
    .values({
      ...globalSettings,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
    })
    .execute();
}

function completeSetup({
  license,
  globalSettings,
  userId,
}: {
  license: VBPayLicense;
  globalSettings: VBPayGlobalSettings;
  userId: string;
}) {
  return db.transaction().execute(async (trx) => {
    insertLicense({
      license,
      userId,
      trx,
    });
    insertGlobalSettings({
      globalSettings,
      userId,
      trx,
    });
  });
}

export { completeSetup };
