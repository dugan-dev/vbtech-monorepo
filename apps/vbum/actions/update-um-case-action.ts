"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { updateUmCase } from "@/repos/um-case-repository";
import { z } from "zod";

import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";
import { CaseFormSchema } from "@/components/worklist/case-form-schema";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: CaseFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["nurse", "ops"];

export const updateUmCaseAction = authedActionClient
  .metadata({
    actionName: "updateUmCaseAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .inputSchema(schema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId } = ctx;

      await updateUmCase(pubId, userId, formData);

      revalidatePath(revalidationPath);
    },
  );
