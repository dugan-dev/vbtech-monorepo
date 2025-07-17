"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { VBPAY_LICENSE_CACHE_KEY } from "@/repos/license-repository";
import { z } from "zod";

import { getTzAdjustedFullDaySpan } from "@workspace/utils/get-tz-adjusted-full-day-span";

import { authedActionClient } from "@/lib/safe-action";
import { SetupFormSchema } from "@/components/setup-form/setup-form-schema";

import { updateVBPayLicense } from "../repositories/update-vbpay-license";

const actionSchema = SetupFormSchema.and(
  z.object({
    revalidationPath: z.string(),
  }),
);

export const updateVBPayLicenseAction = authedActionClient
  .metadata({
    actionName: "updateLicenseAction",
    adminOnly: true,
    allowedTypes: ["bpo"],
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: { licenseInfo, functionality, revalidationPath },
      ctx,
    }) => {
      // get the timezone adjusted full day span
      const { fromDate, toDate } = getTzAdjustedFullDaySpan(
        licenseInfo.fromDate,
        licenseInfo.toDate,
      );

      // update the license in the database
      await updateVBPayLicense({
        license: {
          type: licenseInfo.type,
          clientName: licenseInfo.clientName,
          pocName: licenseInfo.pocName,
          pocPhone: licenseInfo.pocPhone,
          pocEmail: licenseInfo.pocEmail,
          numPayers: Number(licenseInfo.numPayers),
          fromDate,
          toDate,
          functionality: functionality.functionality.join(","),
          paymentTypes: functionality.paymentTypes.join(","),
        },
        userId: ctx.userId,
      });

      // Revalidate the cache
      revalidateTag(VBPAY_LICENSE_CACHE_KEY);

      // revalidate the page
      revalidatePath(revalidationPath);
    },
  );
