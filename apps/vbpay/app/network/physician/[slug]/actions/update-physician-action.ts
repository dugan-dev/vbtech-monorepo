"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { EditPhysicianFormSchema } from "../components/info/edit-physician-form/edit-physician-form-schema";
import { updatePhysician } from "../repos/update-physician";

const updatePhyscianActionSchema = z.object({
  revalidationPath: z.string(),
  payerPubId: z.string(),
  pubId: z.string(),
  formData: EditPhysicianFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updatePhysicianAction = authedActionClient
  .metadata({
    actionName: "updatePhysicianAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(updatePhyscianActionSchema)
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

      // update physician
      await updatePhysician({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
