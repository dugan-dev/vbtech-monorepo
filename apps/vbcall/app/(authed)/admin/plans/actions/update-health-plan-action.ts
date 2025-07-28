"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { HealthPlanFormSchema } from "../components/health-plan-form/health-plan-form-schema";
import { updateHealthPlan } from "../repos/update-health-plan";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: HealthPlanFormSchema,
  clientPubId: z.string(),
});

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

const REQUIRED_USER_ROLE: UserRole = "edit";

export const updateHealthPlanAction = authedActionClient
  .metadata({
    actionName: "updateHealthPlanAction",
    allowedTypes: ALLOWED_USER_TYPES,
    adminOnly: true,
  })
  .schema(schema)
  .action(
    async ({
      parsedInput: { formData, pubId, clientPubId, revalidationPath },
      ctx,
    }) => {
      const { userId, usersAppAttrs } = ctx;

      const clientPermissions = usersAppAttrs.ids?.find(
        (id) => id.id === clientPubId,
      );

      if (
        !clientPermissions ||
        !clientPermissions.userRoles.includes(REQUIRED_USER_ROLE)
      ) {
        throw new Error("User does not have permission to edit this Client.");
      }
      // update health plan
      await updateHealthPlan({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
