"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";
import { editUser } from "@/app/(authed)/admin/users/repos/user-management-repository";

import { ClientFormSchema } from "../components/client-form/client-form-schema";
import { insertClient } from "../repos/insert-client";

const schema = z.object({
  revalidationPath: z.string(),
  formData: ClientFormSchema,
});

export const insertClientAction = authedActionClient
  .metadata({
    actionName: "insertPayerAction",
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
                userMode: "",
                userRoles: [],
              },
            ]
          : [
              {
                id: pubId,
                userMode: "",
                userRoles: [],
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
