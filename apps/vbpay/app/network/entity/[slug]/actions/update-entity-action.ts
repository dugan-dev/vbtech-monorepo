"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { EditEntityFormSchema } from "../components/info/edit-entity-form/edit-entity-form-schema";
import { updateEntity } from "../repos/update-entity";

const updateEntityActionSchema = z.object({
  revalidationPath: z.string(),
  payerPubId: z.string(),
  pubId: z.string(),
  formData: EditEntityFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updateEntityAction = authedActionClient
  .metadata({
    actionName: "updateEntityAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(updateEntityActionSchema)
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
        throw new Error("User does not have permission to edit this entity.");
      }

      // update entity
      await updateEntity({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
