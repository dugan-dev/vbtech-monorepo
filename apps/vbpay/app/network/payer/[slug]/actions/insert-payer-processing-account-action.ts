"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { insertPayerProcessingAccount } from "../repos/insert-payer-processing-account";

const actionSchema = z.object({
  payerPubId: z.string(),
  pubId: z.string(),
  revalidationPath: z.string().optional(),
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const insertPayerProcessingAccountAction = authedActionClient
  .metadata({
    actionName: "insertPayerProcessingAccountAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(actionSchema)
  .action(
    async ({ parsedInput: { pubId, payerPubId, revalidationPath }, ctx }) => {
      const { userId, usersAppAttrs } = ctx;

      const payerPermissions = usersAppAttrs.ids?.find(
        (id) => id.id === payerPubId,
      );

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error("User does not have permission to edit this payer.");
      }

      // insert payer processing account
      await insertPayerProcessingAccount(payerPubId, pubId, userId);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
