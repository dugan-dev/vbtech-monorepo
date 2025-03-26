"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Payer } from "@/types/payer";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { AddPayerSheet } from "../add-payer-sheet";
import { ManagePayersTableColumns } from "./manage-payers-table-columns";

const REQUIRED_USER_ROLES: UserRole[] = ["add"];

type props = {
  payers: Payer[];
  payerTypes: ComboItem[];
  usersAppAttrs: UserAppAttrs;
};

export function ManagePayersTable({
  payers,
  usersAppAttrs,
  payerTypes,
}: props) {
  if (payers.length === 0) {
    return (
      <EmptyView
        title="No Payers Yet"
        description="Get started by adding your first payer to the system."
        icon={<Icons.heartHandshake className="h-12 w-12 text-gray-400 mb-4" />}
      >
        <RestrictByUserAppAttrsClient
          usersAppAttrs={usersAppAttrs}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddPayerSheet payerTypes={payerTypes} />
        </RestrictByUserAppAttrsClient>
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManagePayersTableColumns}
      data={payers}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      initialColumnVisibility={{
        "Legal Business Name": false,
        "Parent Organization": false,
        "Website URL": false,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient
          usersAppAttrs={usersAppAttrs}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddPayerSheet payerTypes={payerTypes} />
        </RestrictByUserAppAttrsClient>
      }
      meta={{
        usersAppAttrs,
      }}
    />
  );
}
