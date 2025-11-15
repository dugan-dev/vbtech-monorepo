"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { insertUmCase } from "@/repos/um-case-repository";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";
import { CaseFormSchema } from "@/components/worklist/case-form-schema";

const schema = z.object({
  revalidationPath: z.string(),
  formData: CaseFormSchema,
});

export const insertUmCaseAction = authedActionClient
  .metadata({
    actionName: "insertUmCaseAction",
    adminOnly: true,
  })
  .inputSchema(schema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    const { userId } = ctx;

    await insertUmCase(formData, userId);

    revalidatePath(revalidationPath);
  });
