"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { authedActionClient } from "@/lib/safe-action";

import { forceChangePassword } from "../repos/user-management-repository";

const actionSchema = z.object({
  userId: z.string(),
  revalidationPath: z.string(),
});

export const forceChangeUserPasswordAction = authedActionClient
  .metadata({ actionName: "forceChangeUserPasswordAction", adminOnly: true })
  .schema(actionSchema)
  .action(async ({ parsedInput: { userId, revalidationPath } }) => {
    const { tempPass } = await forceChangePassword(userId);
    revalidatePath(revalidationPath);
    return { tempPass };
  });
