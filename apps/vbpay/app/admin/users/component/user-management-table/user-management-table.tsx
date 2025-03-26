import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserCognito } from "@/types/user-cognito";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { AddUserSheet } from "../add-user-sheet";
import { UserManagementTableColumns } from "./user-management-table-columns";

type props = {
  users: UserCognito[];
  physicians: DataTablePhysician[];
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
  usersAppAttrs: UserAppAttrs;
};

/**
 * Renders the user management interface.
 *
 * Displays an empty view prompting to add a user when the provided user list is empty,
 * or a data table with current user records and an add user sheet when users are available.
 * The table is configured with preset column visibility and includes related metadata.
 *
 * @param users - Array of user objects; an empty array triggers the empty state view.
 * @param practices - Array of practice options.
 * @param facilities - Array of facility options.
 * @param vendors - Array of vendor options.
 * @param payers - Array of payer options.
 * @param pos - Array of point-of-service options.
 * @param physicians - Array of physician data for user assignments.
 * @param usersType - Metadata defining the type of users.
 *
 * @returns A JSX element representing the user management interface.
 *
 * @remarks Permission checks are not implemented yet; a future update should wrap this
 * component to validate if the current user has appropriate permissions.
 */
export function UserManagementTable({
  users,
  practices,
  facilities,
  vendors,
  payers,
  pos,
  physicians,
  usersAppAttrs,
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
        <RestrictByUserAppAttrsClient usersAppAttrs={usersAppAttrs} adminOnly>
          <AddUserSheet
            vendors={vendors}
            physicians={physicians}
            payers={payers}
            pos={pos}
            practices={practices}
            facilities={facilities}
          />
        </RestrictByUserAppAttrsClient>
      }
      meta={{
        payers,
        pos,
        facilities,
        practices,
        physicians,
        vendors,
        usersAppAttrs,
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
