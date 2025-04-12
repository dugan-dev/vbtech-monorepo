"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { AddNetworkPhysicianFormSchema } from "../components/add-network-physician-form/add-network-physician-form-schema";
import { insertPhysician } from "../repos/insert-network-physician";

const insertNetworkPhysicianActionSchema = z.object({
  revalidationPath: z.string().optional(),
  payerPubId: z.string(),
  formData: AddNetworkPhysicianFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "add";

export const insertNetworkPhysicianAction = authedActionClient
  .metadata({
    actionName: "insertPhysicianAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(insertNetworkPhysicianActionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
      const pubId = newPubId();
      const { userId, usersAppAttrs } = ctx;

      const payerPermissions = usersAppAttrs.ids?.find(
        (id) => id.id === payerPubId,
      );

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error(
          "User does not have permission to add a physician for this payer.",
        );
      }

      await insertPhysician({
        pubId,
        payerPubId,
        userId,
        formData,
      });

      if (revalidationPath) {
        revalidatePath(revalidationPath);
      }
    },
  );
