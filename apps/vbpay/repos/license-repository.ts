import "server-only";

import { cache } from "react";
import { unstable_cache as timedCache } from "next/cache";
import { env } from "@/env/server";

import { db } from "@workspace/db/database";

const VBPAY_LICENSE_CACHE_KEY = "VBPayLicenseInfoCacheKey";
const REVALIDATE_SECONDS = 600; /**
 * Retrieves the first VBPay license record from the database.
 *
 * @returns The first matching VBPay license record, or undefined if no record exists.
 */

async function getVBPayLicenseQry() {
  return await db
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
      "paymentTypes",
      "functionality",
    ])
    .executeTakeFirst();
}

type VBPayLicense = NonNullable<Awaited<ReturnType<typeof getVBPayLicenseQry>>>;

// Create a function that uses Next.js unstable_cache for time-based caching
const getVBPayLicenseWithTimeCache = () => {
  if (env.NODE_ENV !== "production") {
    return getVBPayLicenseQry();
  }

  return timedCache(
    () => {
      return getVBPayLicenseQry();
    },
    [VBPAY_LICENSE_CACHE_KEY],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [VBPAY_LICENSE_CACHE_KEY],
    },
  )();
};

// Wrap with React's cache for request deduplication
export const getVBPayLicense = cache(async () => {
  return getVBPayLicenseWithTimeCache();
});

export { VBPAY_LICENSE_CACHE_KEY, type VBPayLicense };
