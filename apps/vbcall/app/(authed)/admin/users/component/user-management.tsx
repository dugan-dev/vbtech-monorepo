import "server-only";

import { getAllClients } from "@/repos/clients-repository";

import { UserManagementContextProvider } from "../contexts/user-management-context";
import { getAllUsers } from "../repos/user-management-repository";
import { getLastUserSync } from "../repos/user-sync-repository";
import { UserManagementTable } from "./user-management-table/user-management-table";

export async function UserManagement() {
  const [clients, lastUserSync, users] = await Promise.all([
    getAllClients(),
    getLastUserSync(),
    getAllUsers(),
  ]);

  const clientsCombo = clients.map((client) => ({
    label: client.clientName,
    value: client.pubId,
  }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <UserManagementContextProvider
        clients={clientsCombo}
        lastUserSync={lastUserSync?.lastSyncAt}
        users={users}
      >
        <UserManagementTable />
      </UserManagementContextProvider>
    </div>
  );
}
