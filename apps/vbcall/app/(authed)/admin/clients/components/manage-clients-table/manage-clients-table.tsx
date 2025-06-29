"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";

import { Client } from "@/types/client";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@workspace/ui/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { ClientDialog } from "../client-dialog";
import { ManageClientsTableColumns } from "./manage-clients-table-columns";

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

type props = {
  clients: Client[];
};

export function ManageClientsTable({ clients }: props) {
  if (clients.length === 0) {
    return (
      <EmptyView
        title="No Clients Yet"
        description="Get started by adding the first client to the system."
        icon={
          <Icons.briefcaseBusiness className="h-12 w-12 text-primary/80 mb-4" />
        }
      >
        <RestrictByUserAppAttrsClient adminOnly>
          <ClientDialog />
        </RestrictByUserAppAttrsClient>
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManageClientsTableColumns}
      data={clients}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient
          adminOnly
          allowedUserTypes={ALLOWED_USER_TYPES}
        >
          <ClientDialog />
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
