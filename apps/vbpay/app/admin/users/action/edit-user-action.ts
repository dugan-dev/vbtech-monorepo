"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import { authedActionClient } from "@/lib/safe-action";

import { UserFormSchema } from "../component/user-form/user-form-schema";
import { editUser } from "../repos/user-management-repository";

const actionSchema = z.object({
  formData: UserFormSchema,
  userId: z.string(),
  revalidationPath: z.string(),
});

export const editUserAction = authedActionClient
  .metadata({ actionName: "editUserAction" })
  .schema(actionSchema)
  .action(async ({ parsedInput: { formData, userId, revalidationPath } }) => {
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
    await editUser(
      formData.email,
      formData.firstName,
      formData.lastName,
      appAttrs,
      userId,
    );
    revalidatePath(revalidationPath);
  });
