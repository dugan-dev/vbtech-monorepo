"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { EditPhysAffiliatesFormSchema } from "../components/affiliates/edit-affiliates-form/edit-phys-affiliates-schema";
import { updatePhysAffiliates } from "../repos/update-phys-affiliates";

const schema = z.object({
  revalidationPath: z.string(),
  payerPubId: z.string(),
  pubId: z.string(),
  formData: EditPhysAffiliatesFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updatePhysAffiliatesAction = authedActionClient
  .metadata({
    actionName: "updatePhysAffiliatesAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(schema)
  .action(
    async ({
      parsedInput: { formData, pubId, payerPubId, revalidationPath },
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
          "User does not have permission to edit this physician.",
        );
      }

      // update physician affiliates
      await updatePhysAffiliates({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
