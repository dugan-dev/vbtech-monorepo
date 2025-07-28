"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";
import { editUser } from "@/app/(authed)/admin/users/repos/user-management-repository";

import { ClientFormSchema } from "../components/client-form/client-form-schema";
import { insertClient } from "../repos/insert-client";

const schema = z.object({
  revalidationPath: z.string(),
  formData: ClientFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

export const insertClientAction = authedActionClient
  .metadata({
    actionName: "insertPayerAction",
    allowedTypes: ALLOWED_USER_TYPES,
    adminOnly: true,
  })
  .schema(schema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    // New PubId for the new Client
    const pubId = newPubId();

    // Get user auth data
    const { userId, usersAppAttrs, email, firstName, lastName } = ctx;
    const hasIds = usersAppAttrs.ids && usersAppAttrs.ids.length > 0;

    // Update user attributes to include the new client
    const newUserAppAttrs: UserAppAttrs = {
      ...usersAppAttrs,
      ids:
        hasIds && usersAppAttrs.ids
          ? [
              ...usersAppAttrs.ids,
              {
                id: pubId,
                userMode: "csr",
                userRoles: ["edit", "add"],
              },
            ]
          : [
              {
                id: pubId,
                userMode: "csr",
                userRoles: ["edit", "add"],
              },
            ],
    };

    // Update user
    await editUser(
      email || "",
      firstName || "",
      lastName || "",
      newUserAppAttrs,
      userId,
    );

    // Insert Client
    await insertClient({
      input: {
        ...formData,
      },
      pubId,
      userId,
    });

    revalidatePath(revalidationPath);
  });
