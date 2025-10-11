"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { EmptyView } from "@workspace/ui/components/empty-view";

import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { useUserManagementContext } from "../../contexts/user-management-context";
import { SyncUsersActionButton } from "../sync-users-action-button";
import { UserDialog } from "../user-dialog";
import { UserManagementTableColumns } from "./user-management-table-columns";

export function UserManagementTable() {
  const { users, clients } = useUserManagementContext();
  const [open, setIsOpen] = useState(false);

  if (users.length === 0) {
    return (
      <EmptyView
        title="No Users Yet"
        description="Get started by adding your first user to the system."
        icon={<UserPlus className="h-12 w-12 text-gray-400 mb-4" />}
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
          <Button onClick={() => setIsOpen(true)}>Add User </Button>
          <UserDialog open={open} setIsOpen={setIsOpen} />
          <SyncUsersActionButton />
        </RestrictByUserAppAttrsClient>
      }
      initialColumnVisibility={{
        "Created At": false,
        "Updated At": false,
        "Last Active": false,
        "Last Sign In": false,
      }}
      meta={{ clients }}
    />
  );
}
