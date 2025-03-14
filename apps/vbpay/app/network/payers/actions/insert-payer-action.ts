"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { insertPayer } from "../repos/insert-payer";

const insertPayerActionSchema = z.object({
  revalidationPath: z.string(),
  formData: z.object({
    payerType: z.string(),
    initPerfYr: z.number(),
    initPerfMo: z.number(),
    cmsId: z.string().length(5).optional(),
    marketingName: z.string().max(255),
    legalName: z.string().max(255).optional(),
    referenceName: z.string().max(20).optional(),
    taxId: z.string().length(9).optional(),
    parentOrgName: z.string().max(255).optional(),
    websiteUrl: z.string().url().optional(),
  }),
});

export const insertPayerAction = authedActionClient
  .metadata({ actionName: "insertPayerAction" })
  .schema(insertPayerActionSchema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    const pubId = newPubId();

    await insertPayer({
      input: {
        ...formData,
        newPubId: pubId,
      },
      userId: ctx.userId,
    });

    // TODO: Add new payer to usersAllowedPayers
    // Since we have a new payer, we need to grant access to it for the creator.
    /* await addUserCreatedPayerToUsersAllowedPayers({
      userId: ctx.userId,
      payerPubId: pubId,
    }); */

    revalidatePath(revalidationPath);
  });
