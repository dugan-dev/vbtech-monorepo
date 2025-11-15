"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { PhysicianFormSchema } from "../components/physician-form/physician-form-schema";
import { updatePhysician } from "../repos/update-physician";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: PhysicianFormSchema,
});

export const updatePhysicianAction = authedActionClient
  .metadata({
    actionName: "updatePhysicianAction",
    adminOnly: true,
  })
  .inputSchema(schema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId } = ctx;

      // update physician
      await updatePhysician({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
