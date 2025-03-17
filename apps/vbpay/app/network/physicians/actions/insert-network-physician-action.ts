"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { AddNetworkPhysicianFormSchema } from "../components/add-network-physician-form/add-network-physician-form-schema";
import { insertPhysician } from "../repos/insert-network-physician";

const insertNetworkPhysicianActionSchema = z.object({
  revalidationPath: z.string().optional(),
  payerPubId: z.string(),
  formData: AddNetworkPhysicianFormSchema,
});

export const insertNetworkPhysicianAction = authedActionClient
  .metadata({ actionName: "insertPhysicianAction" })
  .schema(insertNetworkPhysicianActionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
      const pubId = newPubId();

      await insertPhysician({
        pubId,
        payerPubId,
        userId: ctx.userId,
        formData,
      });

      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
