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

export function insertNetworkEntity({
  input,
  pubId,
  payerPubId,
  userId,
}: props) {
  return db.transaction().execute(async (trx) => {
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

    return trx
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
  });
}
