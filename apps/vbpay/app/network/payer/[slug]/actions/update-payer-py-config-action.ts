"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { PayerPyConfigFormSchema } from "../components/py-config/payer-py-config-form-schema";
import { updatePayerPyConfig } from "../repos/payer-py-config-repository";

const actionSchema = z.object({
  formData: PayerPyConfigFormSchema,
  pubId: z.string(),
  revalidationPath: z.string().optional(),
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updatePayerPyConfigAction = authedActionClient
  .metadata({
    actionName: "updatePayerPyConfigAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(actionSchema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId, usersAppAttrs } = ctx;

      const payerPermissions = usersAppAttrs.ids?.find((id) => id.id === pubId);

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error(
          "User does not have permission to add a physician for this payer.",
        );
      }

      // update py config
      await updatePayerPyConfig(formData, userId, pubId);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
