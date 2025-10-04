"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";

import { HealthPlanFormSchema } from "../components/health-plan-form/health-plan-form-schema";
import { insertHealthPlan } from "../repos/insert-health-plan";

const schema = z.object({
  revalidationPath: z.string(),
  formData: HealthPlanFormSchema,
  clientPubId: z.string(),
});

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

const REQUIRED_USER_ROLE: UserRole = "admin";

export const insertHealthPlanAction = authedActionClient
  .metadata({
    actionName: "insertHealthPlanAction",
    allowedTypes: ALLOWED_USER_TYPES,
    adminOnly: true,
  })
  .schema(schema)
  .action(
    async ({
      parsedInput: { formData, revalidationPath, clientPubId },
      ctx,
    }) => {
      // New PubId for the new HealthPlan
      const pubId = newPubId();

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

      // Insert health plan
      await insertHealthPlan({
        input: {
          ...formData,
        },
        pubId,
        userId,
        clientPubId,
      });

      revalidatePath(revalidationPath);
    },
  );
