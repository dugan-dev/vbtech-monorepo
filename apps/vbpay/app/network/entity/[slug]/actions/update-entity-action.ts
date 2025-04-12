"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { EditEntityFormSchema } from "../components/info/edit-entity-form/edit-entity-form-schema";
import { updateEntity } from "../repos/update-entity";

const updateEntityActionSchema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: EditEntityFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

export const updateEntityAction = authedActionClient
  .metadata({
    actionName: "updateEntityAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(updateEntityActionSchema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      // update entity
      await updateEntity({
        input: formData,
        pubId,
        userId: ctx.userId,
      });

      revalidatePath(revalidationPath);
    },
  );
