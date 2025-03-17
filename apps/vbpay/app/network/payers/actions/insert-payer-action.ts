"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { AddPayerFormSchema } from "../components/add-payer-form/add-payer-form-schema";
import { insertPayer } from "../repos/insert-payer";

const insertPayerActionSchema = z.object({
  revalidationPath: z.string(),
  formData: AddPayerFormSchema,
});

export const insertPayerAction = authedActionClient
  .metadata({ actionName: "insertPayerAction" })
  .schema(insertPayerActionSchema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    const pubId = newPubId();

    await insertPayer({
      input: {
        ...formData,
      },
      pubId,
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
