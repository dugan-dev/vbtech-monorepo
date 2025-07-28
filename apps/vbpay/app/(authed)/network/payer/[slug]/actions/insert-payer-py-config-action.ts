"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { PayerPyConfigFormSchema } from "../components/py-config/payer-py-config-form-schema";
import { insertPayerPyConfig } from "../repos/payer-py-config-repository";

const actionSchema = z.object({
  formData: PayerPyConfigFormSchema,
  payerPubId: z.string(),
  revalidationPath: z.string().optional(),
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const insertPayerPyConfigAction = authedActionClient
  .metadata({
    actionName: "insertPayerPyConfigAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
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
      // generate pubId
      const pubId = newPubId();

      // insert py config
      await insertPayerPyConfig(formData, userId, payerPubId, pubId);

      // revalidate page
      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
