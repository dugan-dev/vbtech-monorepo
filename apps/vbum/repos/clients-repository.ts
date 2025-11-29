import { cache } from "react";

import { db } from "@workspace/vbum-db/database";

import "server-only";

/**
 * Retrieves all active clients from the database.
 *
 * @returns A promise that resolves to an array of objects containing the public ID and client name for each active client.
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
 * Retrieves all clients from the database, returning their public IDs and names.
 *
 * @returns A promise that resolves to an array of client records, each containing `pubId` and `clientName`.
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
