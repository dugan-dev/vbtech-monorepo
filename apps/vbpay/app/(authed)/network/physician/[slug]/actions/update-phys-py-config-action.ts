"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { PhysPyConfigFormSchema } from "../components/py-config/phys-py-config-form-schema";
import { updatePhysPyConfig } from "../repos/phys-py-config-repository";

const actionSchema = z.object({
  formData: PhysPyConfigFormSchema,
  payerPubId: z.string(),
  pubId: z.string(),
  revalidationPath: z.string(),
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updatePhysPyConfigAction = authedActionClient
  .metadata({
    actionName: "updatePhysPyConfigAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, pubId, revalidationPath },
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
        throw new Error(
          "User does not have permission to add a physician for this Physician.",
        );
      }

      // update py config
      await updatePhysPyConfig(formData, userId, pubId);

      // revalidate page
      revalidatePath(revalidationPath);
    },
  );
