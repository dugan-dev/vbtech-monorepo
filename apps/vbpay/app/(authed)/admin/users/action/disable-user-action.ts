"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { authedActionClient } from "@/lib/safe-action";

import { disableUser } from "../repos/user-management-repository";

const actionSchema = z.object({
  userId: z.string(),
  revalidationPath: z.string(),
});

export const disableUserAction = authedActionClient
  .metadata({
    actionName: "disableUserAction",
    adminOnly: true,
  })
  .schema(actionSchema)
  .action(async ({ parsedInput: { userId, revalidationPath } }) => {
    await disableUser(userId);
    revalidatePath(revalidationPath);
  });
