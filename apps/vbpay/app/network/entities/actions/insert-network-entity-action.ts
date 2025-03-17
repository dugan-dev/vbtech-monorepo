"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { AddNetworkEntityFormSchema } from "../components/add-network-entity-form/add-network-entity-form-schema";
import { insertNetworkEntity } from "../repos/insert-network-entity";

const insertEntityActionSchema = z.object({
  revalidationPath: z.string(),
  payerPubId: z.string(),
  formData: AddNetworkEntityFormSchema,
});

export const insertNetworkEntityAction = authedActionClient
  .metadata({ actionName: "insertNetworkEntityAction" })
  .schema(insertEntityActionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
      const pubId = newPubId();

      await insertNetworkEntity({
        input: formData,
        pubId,
        payerPubId,
        userId: ctx.userId,
      });

      revalidatePath(revalidationPath);
    },
  );
