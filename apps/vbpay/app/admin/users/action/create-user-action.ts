"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { UserFormSchema } from "../component/user-form/user-form-schema";
import { createUser } from "../repos/user-management-repository";

const actionSchema = z.object({
  formData: UserFormSchema,
  revalidationPath: z.string(),
});

export const createUserAction = authedActionClient
  .metadata({
    actionName: "createUserAction",
    adminOnly: true,
  })
  .schema(actionSchema)
  .action(async ({ parsedInput: { formData, revalidationPath } }) => {
    const appAttrs: UserAppAttrs = {
      app: "VBPay",
      admin: formData.admin,
      super: formData.super,
      type: formData.type as UserType,
      ids: formData.ids.map((id) => ({
        id: id.id,
        userMode: id.userMode,
        userRoles: id.userRoles,
      })),
    };
    await createUser(
      formData.email,
      formData.firstName,
      formData.lastName,
      appAttrs,
    );
    revalidatePath(revalidationPath);
  });
