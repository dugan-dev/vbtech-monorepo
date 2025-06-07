import "server-only";

import { VBPayGlobalSettings } from "@/repos/global-settings-repository";
import { VBPayLicense } from "@/repos/license-repository";

import { db } from "@workspace/db/database";

/**
 * Performs initial setup by inserting license and global settings records into the database within a single transaction.
 *
 * @param license - The license data to be stored.
 * @param globalSettings - The global settings data to be stored.
 * @param userId - The ID of the user performing the setup.
 * @returns An object indicating successful completion of the setup.
 */
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
