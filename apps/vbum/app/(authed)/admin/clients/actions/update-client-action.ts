"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { ClientFormSchema } from "../components/client-form/client-form-schema";
import { updateClient } from "../repos/update-client";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: ClientFormSchema,
});

export const updateClientAction = authedActionClient
  .metadata({
    actionName: "updateClientAction",
    adminOnly: true,
  })
  .inputSchema(schema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId } = ctx;

      // update client
      await updateClient({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
