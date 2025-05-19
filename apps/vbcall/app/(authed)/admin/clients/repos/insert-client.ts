import "server-only";

import { ReferenceExpression } from "kysely";

import { db } from "@workspace/vbcall-db/database";
import { DB } from "@workspace/vbcall-db/types";

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

export function insertClient({ input, pubId, userId }: props) {
  return db.transaction().execute(async (trx) => {
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

    return trx
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
  });
}
