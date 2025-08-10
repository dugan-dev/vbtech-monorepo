"use server";

import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { VBPAY_GLOBAL_SETTINGS_CACHE_KEY } from "@/repos/global-settings-repository";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";
import { SetupFormSchema } from "@/components/setup-form/setup-form-schema";

import { updateVBPayGlobalSettings } from "../repositories/update-vbpay-global-settings";

const actionSchema = SetupFormSchema.and(
  z.object({
    revalidationPath: z.string().optional(),
  }),
);

export const updateVBPayGlobalSettingsAction = authedActionClient
  .metadata({ actionName: "updateVBPayGlobalSettingsAction", adminOnly: true })
  .schema(actionSchema)
  .action(
    async ({ parsedInput: { globalSettings, revalidationPath }, ctx }) => {
      // Update global settings in DB
      await updateVBPayGlobalSettings({
        settings: {
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

      // revalidate cache
      revalidateTag(VBPAY_GLOBAL_SETTINGS_CACHE_KEY);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
