"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { enableUser } from "../repos/user-management-repository";

const actionSchema = z.object({
  userId: z.string(),
  revalidationPath: z.string(),
});

export const enableUserAction = authedActionClient
  .metadata({ actionName: "enableUserAction", adminOnly: true })
  .schema(actionSchema)
  .action(async ({ parsedInput: { userId, revalidationPath } }) => {
    await enableUser(userId);
    revalidatePath(revalidationPath);
  });
