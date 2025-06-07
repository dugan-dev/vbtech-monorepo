import "server-only";

import { ReferenceExpression } from "kysely";

import { db } from "@workspace/db/database";
import { DB } from "@workspace/db/types";

import { NetworkEntity } from "@/types/network-entity";

import { AddNetworkEntityFormOutput } from "../components/add-network-entity-form/add-network-entity-form-schema";

type DuplicateCheck = {
  value: string | undefined;
  field: keyof NetworkEntity;
  displayName: string;
};

type props = {
  input: AddNetworkEntityFormOutput;
  pubId: string;
  payerPubId: string;
  userId: string;
};

/**
 * Inserts a new network entity record into the database, ensuring no duplicate key fields exist for the same payer and entity type.
 *
 * Checks for duplicates on marketing name, reference name, tax ID, and organization NPI before insertion. If any duplicates are found, the operation is aborted and an error is thrown.
 *
 * @param input - The form data for the new network entity.
 * @param pubId - The publisher ID for the new entity.
 * @param payerPubId - The payer's publisher ID to associate with the entity.
 * @param userId - The ID of the user performing the insertion.
 * @returns An object indicating success: `{ success: true }`.
 *
 * @throws {Error} If a network entity with the same marketing name, reference name, tax ID, or organization NPI already exists for the given payer and entity type.
 */
export async function insertNetworkEntity({
  input,
  pubId,
  payerPubId,
  userId,
}: props) {
  return await db.transaction().execute(async (trx) => {
    const duplicateChecks: DuplicateCheck[] = [
      {
        value: input.marketingName,
        field: "marketingName",
        displayName: "Marketing Name",
      },
      {
        value: input.referenceName,
        field: "referenceName",
        displayName: "Acronym/Nickname",
      },
      { value: input.taxId, field: "taxId", displayName: "Tax ID" },
      { value: input.orgNpi, field: "orgNpi", displayName: "Org NPI" },
    ];

    const duplicateResults = await Promise.all(
      duplicateChecks
        .filter((check) => check.value !== undefined)
        .map(({ field, value }) =>
          trx
            .selectFrom("networkEntity")
            .select([field])
            .where(
              field as ReferenceExpression<DB, "networkEntity">,
              "=",
              value!,
            )
            .where("payerPubId", "=", payerPubId)
            .where("netEntType", "=", input.netEntType)
            .executeTakeFirst(),
        ),
    );

    const duplicateFields = duplicateChecks
      .filter((_, index) => duplicateResults[index])
      .map((check) => check.displayName);

    if (duplicateFields.length > 0) {
      throw new Error(
        `Duplicate Network Entity found with the same: ${duplicateFields.join(", ")}. Please update the information and try again.`,
      );
    }

    const now = new Date();

    await trx
      .insertInto("networkEntity")
      .values({
        pubId,
        marketingName: input.marketingName,
        legalName: input.legalName,
        referenceName: input.referenceName,
        orgNpi: input.orgNpi,
        taxId: input.taxId,
        isActive: 1,
        payerPubId: payerPubId,
        netEntType: input.netEntType,
        createdBy: userId,
        createdAt: now,
        updatedBy: userId,
        updatedAt: now,
      })
      .execute();

    return { success: true };
  });
}
