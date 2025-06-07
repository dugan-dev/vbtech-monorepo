import { cache } from "react";

import { db } from "@workspace/vbcall-db/database";

import "server-only";

async function getAllActiveClientsQry() {
  return await db
    .selectFrom("client")
    .select(["client.pubId", "client.clientName"])
    .where("client.isActive", "=", 1)
    .execute();
}

export const getAllActiveClients = cache(async () => {
  return getAllActiveClientsQry();
});

async function getAllClientsQry() {
  return await db
    .selectFrom("client")
    .select(["client.pubId", "client.clientName"])
    .execute();
}

export const getAllClients = cache(async () => {
  return getAllClientsQry();
});
