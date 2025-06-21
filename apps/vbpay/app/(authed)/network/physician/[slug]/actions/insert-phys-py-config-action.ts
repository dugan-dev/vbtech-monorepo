"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { newPubId } from "@workspace/ui/lib/nanoid";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { PhysPyConfigFormSchema } from "../components/py-config/phys-py-config-form-schema";
import { insertPhysPyConfig } from "../repos/phys-py-config-repository";

const actionSchema = z.object({
  formData: PhysPyConfigFormSchema,
  payerPubId: z.string(),
  physPubId: z.string(),
  revalidationPath: z.string(),
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const insertPhysPyConfigAction = authedActionClient
  .metadata({
    actionName: "insertPhysPyConfigAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(actionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, physPubId, revalidationPath },
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
      await insertPhysPyConfig(formData, userId, physPubId, pubId);

      // revalidate page
      revalidatePath(revalidationPath);
    },
  );
