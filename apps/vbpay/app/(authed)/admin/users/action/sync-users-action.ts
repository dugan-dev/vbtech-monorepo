"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { syncUsers } from "../repos/user-sync-repository";

const actionSchema = z.object({ revalidationPath: z.string() });

export const syncUsersAction = authedActionClient
  .metadata({ actionName: "SyncUsersAction", adminOnly: true })
  .schema(actionSchema)
  .action(async ({ ctx, parsedInput: { revalidationPath } }) => {
    await syncUsers(ctx.userId);
    revalidatePath(revalidationPath);
  });
