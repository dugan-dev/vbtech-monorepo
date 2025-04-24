import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { UserCognito } from "@/types/user-cognito";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { AddUserSheet } from "../add-user-sheet";
import { SyncUsersActionButton } from "../sync-users-action-button";
import { UserManagementTableColumns } from "./user-management-table-columns";

type props = {
  users: UserCognito[];
  physicians: DataTablePhysician[];
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
  lastUserSync?: Date;
};

/**
 * Displays a user management interface with options to add and sync users.
 *
 * Renders an empty state prompt if no users are present, or a data table of users with administrative actions and related metadata when users exist.
 *
 * @param users - List of users to display; an empty array triggers the empty state.
 * @param practices - Available practice options for user assignment.
 * @param facilities - Available facility options for user assignment.
 * @param vendors - Available vendor options for user assignment.
 * @param payers - Available payer options for user assignment.
 * @param pos - Available point-of-service options for user assignment.
 * @param physicians - Available physicians for user assignment.
 * @param lastUserSync - Timestamp of the last user synchronization, if available.
 *
 * @returns The user management interface as a JSX element.
 */
export function UserManagementTable({
  users,
  practices,
  facilities,
  vendors,
  payers,
  pos,
  physicians,
  lastUserSync,
}: props) {
  if (users.length === 0) {
    return (
      <EmptyView
        title="No Users Yet"
        description="Get started by adding your first user to the system."
        icon={<Icons.userPlus className="h-12 w-12 text-gray-400 mb-4" />}
        actionText={`Click the "Add User" button above to create a new user.`}
      />
    );
  }

  return (
    <DataTable
      columns={UserManagementTableColumns}
      data={users}
      options={{
        initialPageSize: 8,
        enableGlobalSearch: true,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient adminOnly>
          <AddUserSheet
            vendors={vendors}
            physicians={physicians}
            payers={payers}
            pos={pos}
            practices={practices}
            facilities={facilities}
          />
          <SyncUsersActionButton lastSync={lastUserSync} />
        </RestrictByUserAppAttrsClient>
      }
      meta={{
        payers,
        pos,
        facilities,
        practices,
        physicians,
        vendors,
      }}
      initialColumnVisibility={{
        "Created At": false,
        "Updated At": false,
        "Last Active": false,
        "Last Sign In": false,
      }}
    />
  );
}
