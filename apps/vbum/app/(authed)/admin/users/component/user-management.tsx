import "server-only";

import { getAllClients } from "@/repos/clients-repository";

import { UserTypeLabels, UserTypes } from "@/types/user-type";

import { UserManagementContextProvider } from "../contexts/user-management-context";
import { getAllUsers } from "../repos/user-management-repository";
import { getLastUserSync } from "../repos/user-sync-repository";
import { UserManagementTable } from "./user-management-table/user-management-table";

/**
 * Render the user management view that provides clients, user types, users, and last sync time to its children.
 *
 * @returns A JSX element containing a UserManagementContextProvider (supplied with clients, userTypes, users, and lastUserSync) that wraps the UserManagementTable component.
 */
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

  const userTypesCombo = UserTypes.map((ut) => ({
    label: UserTypeLabels[ut],
    value: ut,
  }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <UserManagementContextProvider
        clients={clientsCombo}
        lastUserSync={lastUserSync?.lastSyncAt}
        users={users}
        userTypes={userTypesCombo}
      >
        <UserManagementTable />
      </UserManagementContextProvider>
    </div>
  );
}
