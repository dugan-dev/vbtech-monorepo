import { cache } from "react";
import { unstable_cache as timedCache } from "next/cache";
import { env } from "@/env/server";

import { db } from "@workspace/db/database";

import "server-only";

const VBPAY_GLOBAL_SETTINGS_CACHE_KEY = "GlobalSettingsCacheKey";
const REVALIDATE_SECONDS = 600; // 10 minutes

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

function getVBPayGlobalSettingsWithTimedCache() {
  if (env.NODE_ENV !== "production") {
    const globalSettings = getVBPayGlobalSettingsQry();
    return globalSettings;
  }

  return timedCache(
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

const getVBPayGlobalSettings = cache(async () => {
  return getVBPayGlobalSettingsWithTimedCache();
});

export {
  getVBPayGlobalSettings,
  type VBPayGlobalSettings,
  VBPAY_GLOBAL_SETTINGS_CACHE_KEY,
};
