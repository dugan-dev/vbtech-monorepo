import { unstable_cache as cache } from "next/cache";
import { env } from "@/env/server";

import { db } from "@workspace/db/database";

import "server-only";

const VBPAY_GLOBAL_SETTINGS_CACHE_KEY = "GlobalSettingsCacheKey";
const REVALIDATE_SECONDS = 600; /**
 * Retrieves VBPay global settings from the database.
 *
 * This function executes a query on the "vbpayGlobalSettings" table, selecting key configuration
 * fields such as payer types, tax IDs, and credentials, and returns the first record found.
 *
 * @returns The first record of VBPay global settings, or undefined if no record exists.
 */

function getVBPayGlobalSettingsQry() {
  return db
    .selectFrom("vbpayGlobalSettings")
    .select([
      "allowedPayerTypes",
      "poReqTaxId",
      "poReqNpi",
      "pracReqNpi",
      "pracReqTaxId",
      "physReqTaxId",
      "physReqCred",
      "physReqSpec",
      "physNppesRecon",
      "faclReqNpi",
      "faclReqTaxId",
      "payerReqTaxId",
    ])
    .executeTakeFirst();
}

type VBPayGlobalSettings = NonNullable<
  Awaited<ReturnType<typeof getVBPayGlobalSettingsQry>>
>;

/**
 * Retrieves the VBPay global settings.
 *
 * In non-production environments, the settings are fetched directly from the database.
 * In production, the result is cached for 10 minutes to optimize performance.
 *
 * @returns The VBPay global settings.
 */
function getVBPayGlobalSettings() {
  if (env.NODE_ENV !== "production") {
    const globalSettings = getVBPayGlobalSettingsQry();
    return globalSettings;
  }

  return cache(
    () => {
      const globalSettings = getVBPayGlobalSettingsQry();
      return globalSettings;
    },
    [VBPAY_GLOBAL_SETTINGS_CACHE_KEY],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [VBPAY_GLOBAL_SETTINGS_CACHE_KEY],
    },
  )();
}

export {
  getVBPayGlobalSettings,
  type VBPayGlobalSettings,
  VBPAY_GLOBAL_SETTINGS_CACHE_KEY,
};
