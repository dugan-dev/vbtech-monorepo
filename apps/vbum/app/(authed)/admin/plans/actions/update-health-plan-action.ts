"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authedActionClient } from "@/lib/safe-action";

import { HealthPlanFormSchema } from "../components/health-plan-form/health-plan-form-schema";
import { updateHealthPlan } from "../repos/update-health-plan";

const schema = z.object({
  revalidationPath: z.string(),
  pubId: z.string(),
  formData: HealthPlanFormSchema,
  clientPubId: z.string(),
});

export const updateHealthPlanAction = authedActionClient
  .metadata({
    actionName: "updateHealthPlanAction",
    adminOnly: true,
  })
  .inputSchema(schema)
  .action(
    async ({ parsedInput: { formData, pubId, revalidationPath }, ctx }) => {
      const { userId } = ctx;

      // update health plan
      await updateHealthPlan({
        input: formData,
        pubId,
        userId: userId,
      });

      revalidatePath(revalidationPath);
    },
  );
