"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { deletePaymentMethod } from "@/repos/payload-payment-method-repository";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

const ALLOWED_USER_TYPES: UserType[] = [
  "bpo",
  "payer",
  "payers",
  "po",
  "facility",
  "practice",
  "vendor",
];

const REQUIRED_USER_ROLE: UserRole = "edit";

const schema = z.object({
  id: z.string(),
  revalidationPath: z.string(),
  payerPubId: z.string(),
});

export const deletePayloadPaymentMethodAction = authedActionClient
  .metadata({
    actionName: "deletePayloadPaymentMethodAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(schema)
  .action(
    async ({ parsedInput: { id, payerPubId, revalidationPath }, ctx }) => {
      const { usersAppAttrs } = ctx;

      const payerPermissions = usersAppAttrs.ids?.find(
        (id) => id.id === payerPubId,
      );

      if (
        !payerPermissions ||
        !payerPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error("User does not have permission to edit this entity.");
      }

      deletePaymentMethod(id);

      revalidatePath(revalidationPath);
    },
  );
