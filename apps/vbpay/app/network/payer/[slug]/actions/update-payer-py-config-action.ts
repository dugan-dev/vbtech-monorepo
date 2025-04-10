"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { PayerPyConfigFormSchema } from "../components/py-config/payer-py-config-form-schema";
import { updatePayerPyConfig } from "../repos/payer-py-config-repository";

const actionSchema = z.object({
  formData: PayerPyConfigFormSchema,
  pubId: z.string(),
  revalidationPath: z.string().optional(),
});

export const updatePayerPyConfigAction = authedActionClient
  .metadata({
    actionName: "updatePayerPyConfigAction",
    allowedTypes: ["bpo", "payer", "payers"],
  })
  .schema(actionSchema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      // update py config
      await updatePayerPyConfig(formData, ctx.userId, pubId);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
