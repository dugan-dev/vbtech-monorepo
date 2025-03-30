import "server-only";

import { unstable_cache as cache } from "next/cache";
import { env } from "@/env/server";

import { db } from "@workspace/db/database";

const VBPAY_LICENSE_CACHE_KEY = "VBPayLicenseInfoCacheKey";
const REVALIDATE_SECONDS = 600; // 10 minutes

function getVBPayLicenseQry() {
  return db
    .selectFrom("vbpayLicense")
    .select([
      "type",
      "fromDate",
      "toDate",
      "clientName",
      "pocName",
      "pocPhone",
      "pocEmail",
      "numPayers",
      "functionality",
    ])
    .executeTakeFirst();
}

type VBPayLicense = NonNullable<Awaited<ReturnType<typeof getVBPayLicenseQry>>>;

function getVBPayLicense() {
  if (env.NODE_ENV !== "production") {
    const license = getVBPayLicenseQry();
    return license;
  }

  return cache(
    () => {
      const license = getVBPayLicenseQry();
      return license;
    },
    [VBPAY_LICENSE_CACHE_KEY],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [VBPAY_LICENSE_CACHE_KEY],
    },
  )();
}

export { getVBPayLicense, VBPAY_LICENSE_CACHE_KEY, type VBPayLicense };
