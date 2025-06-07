import "server-only";

import { VBPayGlobalSettings } from "@/repos/global-settings-repository";
import { VBPayLicense } from "@/repos/license-repository";

import { db } from "@workspace/db/database";

async function completeSetup({
  license,
  globalSettings,
  userId,
}: {
  license: VBPayLicense;
  globalSettings: VBPayGlobalSettings;
  userId: string;
}) {
  const now = new Date();

  return await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("vbpayLicense")
      .values({
        ...license,
        createdAt: now,
        createdBy: userId,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();
    await trx
      .insertInto("vbpayGlobalSettings")
      .values({
        ...globalSettings,
        createdAt: now,
        createdBy: userId,
        updatedAt: now,
        updatedBy: userId,
      })
      .execute();

    return { success: true };
  });
}

export { completeSetup };
