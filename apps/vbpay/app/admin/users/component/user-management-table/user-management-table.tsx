"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { UserCognito } from "@/types/user-cognito";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@/components/empty-view";
import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";

import { useUserManagementTable } from "../../hooks/use-user-management-table";
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
  usersType: UserType;
};

export function UserManagementTable({
  users,
  practices,
  facilities,
  vendors,
  payers,
  pos,
  physicians,
  usersType,
}: props) {
  const { isErrorDialogOpen, errorMsg, errorTitle, closeErrorDialog } =
    useUserManagementTable();

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
    <>
      <DataTable
        columns={UserManagementTableColumns}
        data={users}
        options={{
          initialPageSize: 8,
          enableGlobalSearch: true,
        }}
        // TODO: Wrap with user is to determine if user has appropriate permissions.
        itemsAboveTable={
          <AddUserSheet
            vendors={vendors}
            physicians={physicians}
            payers={payers}
            pos={pos}
            practices={practices}
            facilities={facilities}
          />
        }
        meta={{
          payers,
          pos,
          facilities,
          practices,
          physicians,
          vendors,
          usersType,
        }}
        initialColumnVisibility={{
          "Created At": false,
          "Updated At": false,
          "Last Active": false,
          "Last Sign In": false,
        }}
      />
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg}
          title={errorTitle}
        />
      )}
    </>
  );
}
