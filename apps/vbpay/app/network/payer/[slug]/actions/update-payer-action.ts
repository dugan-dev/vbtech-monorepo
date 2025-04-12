"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { EditPayerFormSchema } from "../components/info/edit-payer-form/edit-payer-form-schema";
import { updatePayer } from "../repos/update-payer";

const updatePayerActionSchema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: EditPayerFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updatePayerAction = authedActionClient
  .metadata({
    actionName: "updatePayerAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(updatePayerActionSchema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId, usersAppAttrs } = ctx;

      const payerPermisssions = usersAppAttrs.ids?.find(
        (id) => id.id === pubId,
      );

      if (
        !payerPermisssions ||
        !payerPermisssions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error("User does not have permission to edit this payer.");
      }
      // update Payer
      await updatePayer({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
