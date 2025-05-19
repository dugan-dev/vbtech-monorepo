"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { ClientFormSchema } from "../components/client-form/client-form-schema";
import { updateClient } from "../repos/update-client";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: ClientFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updateClientAction = authedActionClient
  .metadata({
    actionName: "updateClientAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(schema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId, usersAppAttrs } = ctx;

      const payerPermissions = usersAppAttrs.ids?.find((id) => id.id === pubId);

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error("User does not have permission to edit this Client.");
      }
      // update client
      await updateClient({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
