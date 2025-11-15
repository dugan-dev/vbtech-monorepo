"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { PhysicianFormSchema } from "../components/physician-form/physician-form-schema";
import { insertPhysician } from "../repos/insert-physician";

const schema = z.object({
  revalidationPath: z.string(),
  formData: PhysicianFormSchema,
});

export const insertPhysicianAction = authedActionClient
  .metadata({
    actionName: "insertPhysicianAction",
    adminOnly: true,
  })
  .inputSchema(schema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    // New PubId for the new Client
    const pubId = newPubId();

    // Get user auth data
    const { userId } = ctx;

    // Insert Physician
    await insertPhysician({
      input: {
        ...formData,
      },
      pubId,
      userId,
    });

    revalidatePath(revalidationPath);
  });
