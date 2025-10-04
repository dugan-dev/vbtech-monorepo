import { getClientsForTable } from "@/app/(authed)/admin/clients/repos/get-payers-for-table";

export type Client = NonNullable<
  Awaited<ReturnType<typeof getClientsForTable>>
>[0];
