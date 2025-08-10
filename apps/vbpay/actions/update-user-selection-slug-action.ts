"use server";

import "server-only";

import { updateUserSelectionSlug } from "@/repos/user-repository";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

const schema = z.object({
  slug: z.string(),
});

export const updateUserSelectionSlugAction = authedActionClient
  .metadata({ actionName: "updateUserSelectionSlugAction" })
  .schema(schema)
  .action(async ({ parsedInput: { slug }, ctx }) => {
    return await updateUserSelectionSlug(ctx.userId, slug);
  });
