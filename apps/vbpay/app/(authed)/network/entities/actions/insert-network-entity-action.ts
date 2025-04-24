"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { AddNetworkEntityFormSchema } from "../components/add-network-entity-form/add-network-entity-form-schema";
import { insertNetworkEntity } from "../repos/insert-network-entity";

const insertEntityActionSchema = z.object({
  revalidationPath: z.string(),
  payerPubId: z.string(),
  formData: AddNetworkEntityFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

const REQUIRED_USER_ROLE: UserRole = "add";

export const insertNetworkEntityAction = authedActionClient
  .metadata({
    actionName: "insertNetworkEntityAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(insertEntityActionSchema)
  .action(
    async ({
      parsedInput: { formData, payerPubId, revalidationPath },
      ctx,
    }) => {
      // New PubId for the new Entity
      const pubId = newPubId();

      // Get user auth data
      const { userId, usersAppAttrs } = ctx;
      const hasIds = usersAppAttrs.ids && usersAppAttrs.ids.length > 0;

      if (!hasIds) {
        throw new Error(
          "User does not have permission to add an entity for this payer.",
        );
      }

      const payerPermissions = usersAppAttrs.ids?.find(
        (id) => id.id === payerPubId,
      );

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error(
          "User does not have permission to add an entity for this payer.",
        );
      }

      // Insert the new Entity
      await insertNetworkEntity({
        input: formData,
        pubId,
        payerPubId,
        userId,
      });

      revalidatePath(revalidationPath);
    },
  );
