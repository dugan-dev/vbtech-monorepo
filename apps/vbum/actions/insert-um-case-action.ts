"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import {
  getUmCaseByCaseNumber,
  insertUmCase,
} from "@/repos/um-case-repository";
import { z } from "zod";

import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";
import { CaseFormSchema } from "@/components/worklist/case-form-schema";

const schema = z.object({
  revalidationPath: z.string(),
  formData: CaseFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["nurse", "ops"];

export const insertUmCaseAction = authedActionClient
  .metadata({
    actionName: "insertUmCaseAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .inputSchema(schema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    const { userId } = ctx;

    const result = await getUmCaseByCaseNumber(formData.caseId);

    if (result !== undefined) {
      throw new Error("A record with the same case number already exists.");
    }

    await insertUmCase(formData, userId);
    revalidatePath(revalidationPath);
  });
