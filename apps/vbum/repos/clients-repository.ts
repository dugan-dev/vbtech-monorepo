import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieves all active clients from the database.
 *
 * @returns An array of records each containing `pubId` and `clientName`, ordered by `clientName` ascending.
 */
async function getAllActiveClientsQry() {
  return await db
    .selectFrom("client")
    .select(["client.pubId", "client.clientName"])
    .where("client.isActive", "=", 1)
    .orderBy("client.clientName", "asc")
    .execute();
}

export const getAllActiveClients = cache(async () => {
  return getAllActiveClientsQry();
});

/**
 * Retrieves all clients' public IDs and names from the database.
 *
 * @returns An array of client records, each with `pubId` and `clientName`
 */
async function getAllClientsQry() {
  return await db
    .selectFrom("client")
    .select(["client.pubId", "client.clientName"])
    .orderBy("client.clientName", "asc")
    .execute();
}

export const getAllClients = cache(async () => {
  return getAllClientsQry();
});