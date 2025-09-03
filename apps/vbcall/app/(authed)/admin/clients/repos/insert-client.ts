import "server-only";

import { ReferenceExpression } from "kysely";

import { db } from "@workspace/db/database";
import { DB } from "@workspace/db/types";

import { ClientFormOutput } from "../components/client-form/client-form-schema";

type DuplicateCheck = {
  value: string | undefined;
  field: keyof ClientFormOutput;
  displayName: string;
};

type props = {
  input: ClientFormOutput;
  pubId: string;
  userId: string;
};

/**
 * Inserts a new client record into the database after checking for duplicates within a transaction.
 *
 * Checks for existing clients with the same name or code and aborts the operation if duplicates are found.
 *
 * @param input - The client data to insert.
 * @param pubId - The public identifier associated with the client.
 * @param userId - The identifier of the user performing the operation.
 * @returns An object indicating successful insertion.
 *
 * @throws {Error} If a client with the same name or code already exists.
 */
export async function insertClient({ input, pubId, userId }: props) {
  return await db.transaction().execute(async (trx) => {
    const duplicateChecks: DuplicateCheck[] = [
      {
        value: input.clientName,
        field: "clientName",
        displayName: "Client Name",
      },
      {
        value: input.clientCode,
        field: "clientCode",
        displayName: "Client Code",
      },
    ];

    const duplicateResults = await Promise.all(
      duplicateChecks
        .filter((check) => check.value !== undefined)
        .map(({ field, value }) =>
          trx
            .selectFrom("client")
            .select([field])
            .where(field as ReferenceExpression<DB, "client">, "=", value!)
            .executeTakeFirst(),
        ),
    );

    const duplicateFields = duplicateChecks
      .filter((_, index) => duplicateResults[index])
      .map((check) => check.displayName);

    if (duplicateFields.length > 0) {
      throw new Error(
        `Duplicate Client found with the same: ${duplicateFields.join(", ")}. Please update the information and try again.`,
      );
    }

    const now = new Date();

    await trx
      .insertInto("client")
      .values({
        pubId,
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
        clientName: input.clientName,
        clientCode: input.clientCode,
        timezone: input.timezone,
        description: input.description,
        isActive: 1,
      })
      .execute();

    return { success: true };
  });
}
