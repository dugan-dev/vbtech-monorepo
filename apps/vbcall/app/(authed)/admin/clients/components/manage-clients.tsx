import "server-only";

import { getClientsForTable } from "../repos/get-payers-for-table";
import { ManageClientsTable } from "./manage-clients-table/manage-clients-table";

export async function ManageClients() {
  const clients = await getClientsForTable();

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <ManageClientsTable clients={clients} />
    </div>
  );
}
