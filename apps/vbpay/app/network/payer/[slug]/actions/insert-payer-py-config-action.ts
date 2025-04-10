"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { PayerPyConfigFormSchema } from "../components/py-config/payer-py-config-form-schema";
import { insertPayerPyConfig } from "../repos/payer-py-config-repository";

const actionSchema = z.object({
  formData: PayerPyConfigFormSchema,
  payerPubId: z.string(),
  revalidationPath: z.string().optional(),
});

export const insertPayerPyConfigAction = authedActionClient
  .metadata({
    actionName: "insertPayerPyConfigAction",
    allowedTypes: ["bpo", "payer", "payers"],
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
      // generate pubId
      const pubId = newPubId();

      // insert py config
      await insertPayerPyConfig(formData, ctx.userId, payerPubId, pubId);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
