"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { getVBPayLicense } from "@/repos/license-repository";
import { z } from "zod";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserMode } from "@/types/user-mode";
import { UserType } from "@/types/user-type";
import { newPubId } from "@/lib/nanoid";
import { authedActionClient } from "@/lib/safe-action";
import { editUser } from "@/app/admin/users/repos/user-management-repository";

import { AddPayerFormSchema } from "../components/add-payer-form/add-payer-form-schema";
import { getPayerCount } from "../repos/get-payer-count";
import { insertPayer } from "../repos/insert-payer";

const insertPayerActionSchema = z.object({
  revalidationPath: z.string(),
  formData: AddPayerFormSchema,
});

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

export const insertPayerAction = authedActionClient
  .metadata({
    actionName: "insertPayerAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .schema(insertPayerActionSchema)
  .action(async ({ parsedInput: { formData, revalidationPath }, ctx }) => {
    // Get the license and current payer count from the database to ensure a new payer can be addes
    const [license, payerCount] = await Promise.all([
      getVBPayLicense(),
      getPayerCount(),
    ]);

    if (!license || !payerCount || payerCount.payerCount >= license.numPayers) {
      throw new Error(
        "Cannot add new payer. The maximum number of payers reached for this license.",
      );
    }

    // New PubId for the new Payer
    const pubId = newPubId();

    // Get user auth data
    const { userId, usersAppAttrs, email, firstName, lastName } = ctx;
    const hasIds = usersAppAttrs.ids && usersAppAttrs.ids.length > 0;

    // Update user attributes to include the new Payer
    const newUserAppAttrs: UserAppAttrs = {
      ...usersAppAttrs,
      ids:
        hasIds && usersAppAttrs.ids
          ? [
              ...usersAppAttrs.ids,
              {
                id: pubId,
                userMode: formData.payerType as UserMode,
                userRoles: ["edit", "add"],
              },
            ]
          : [
              {
                id: pubId,
                userMode: formData.payerType as UserMode,
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

    // Insert Payer
    await insertPayer({
      input: {
        ...formData,
      },
      pubId,
      userId,
    });

    revalidatePath(revalidationPath);
  });
