"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { VBPAY_LICENSE_CACHE_KEY } from "@/repos/license-repository";
import { z } from "zod/v4";

import { getTzAdjustedFullDaySpan } from "@workspace/utils/get-tz-adjusted-full-day-span";

import { authedActionClient } from "@/lib/safe-action";
import { SetupFormSchema } from "@/components/setup-form/setup-form-schema";

import { completeSetup } from "../repos/setup-repository";

const actionSchema = z.object({
  licenseInfo: SetupFormSchema.shape.licenseInfo,
  functionality: SetupFormSchema.shape.functionality,
  globalSettings: SetupFormSchema.shape.globalSettings,
  revalidationPath: z.string(),
});

export const completeSetupAction = authedActionClient
  .metadata({
    actionName: "CompleteSetupAction",
    allowedTypes: ["bpo"],
    adminOnly: true,
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: {
        licenseInfo,
        functionality,
        globalSettings,
        revalidationPath,
      },
      ctx,
    }) => {
      const { toDate, fromDate } = getTzAdjustedFullDaySpan(
        licenseInfo.fromDate,
        licenseInfo.toDate,
      );

      completeSetup({
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
        globalSettings: {
          payerReqTaxId: Number(globalSettings.payerReqTaxId),
          poReqTaxId: Number(globalSettings.poReqTaxId),
          poReqNpi: Number(globalSettings.poReqNpi),
          pracReqNpi: Number(globalSettings.pracReqNpi),
          pracReqTaxId: Number(globalSettings.pracReqTaxId),
          physReqTaxId: Number(globalSettings.physReqTaxId),
          physReqCred: Number(globalSettings.physReqCred),
          physReqSpec: Number(globalSettings.physReqSpec),
          physNppesRecon: Number(globalSettings.physNppesRecon),
          faclReqNpi: Number(globalSettings.faclReqNpi),
          faclReqTaxId: Number(globalSettings.faclReqTaxId),
          allowedPayerTypes: globalSettings.allowedPayerTypes.join(","),
        },
        userId: ctx.userId,
      });

      // Invalidate the cache for the license info
      revalidateTag(VBPAY_LICENSE_CACHE_KEY);

      revalidatePath(revalidationPath);
    },
  );
