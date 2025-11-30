import { cache } from "react";
import { unstable_cache as timedCache } from "next/cache";

import { db } from "@workspace/vbum-db/database";

import "server-only";

const PROCEDURE_CODE_CACHE_TAG = "procedure-codes";
const REVALIDATE_SECONDS = 3600; // 1 hour

/**
 * Retrieve an active procedure code record by its code.
 *
 * @param procCode - The procedure code to look up
 * @returns The procedure code data if found, or `undefined` if not found
 */
async function getActiveProcedureCodeByCodeQry(procCode: string) {
  return await db
    .selectFrom("procedureCode as pc")
    .select([
      "pc.procCode",
      "pc.procDesc",
      "pc.inScope",
      "pc.program",
      "pc.hasRules",
      "pc.ruleSubgroup",
      "pc.ruleSet",
      "pc.ncd",
      "pc.lcd",
    ])
    .where("pc.isActive", "=", 1)
    .where("pc.procCode", "=", procCode)
    .executeTakeFirst();
}

/**
 * Cached function to retrieve an active procedure code by code.
 *
 * Cache strategy:
 * - Each procedure code is cached individually with key: "procedure-codes-{procCode}"
 * - Cache TTL: 1 hour (procedure codes are relatively static)
 * - Tagged with both global tag and per-code tag for flexible invalidation
 * - Reduces database load for repeated lookups of the same procedure codes
 *
 * Cache invalidation examples:
 *
 * Example 1: Invalidate all procedure codes after bulk import/update
 * ```typescript
 * import { revalidateTag } from "next/cache";
 * revalidateTag('procedure-codes');
 * ```
 *
 * Example 2: Invalidate a specific procedure code after individual update
 * ```typescript
 * import { revalidateTag } from "next/cache";
 * revalidateTag('procedure-codes-12345'); // Invalidates only code "12345"
 * ```
 *
 * @param procCode - The procedure code to look up (cached per unique code)
 * @returns Promise resolving to procedure code data if found, undefined otherwise
 */
const getActiveProcedureCodeByCodeWithTimeCache = (procCode: string) => {
  const cacheKey = `${PROCEDURE_CODE_CACHE_TAG}-${procCode}`;

  return timedCache(
    async () => getActiveProcedureCodeByCodeQry(procCode),
    [cacheKey],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [PROCEDURE_CODE_CACHE_TAG, cacheKey], // Both global and specific tags
    },
  )();
};

// Wrap with React's cache for request deduplication
export const getActiveProcedureCodeByCode = cache(async (procCode: string) => {
  return getActiveProcedureCodeByCodeWithTimeCache(procCode);
});