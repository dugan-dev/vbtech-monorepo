"use client";

import { BriefcaseBusiness } from "lucide-react";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { EmptyView } from "@workspace/ui/components/empty-view";

import { Client } from "@/types/client";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { ClientDialog } from "../client-dialog";
import { ManageClientsTableColumns } from "./manage-clients-table-columns";

type props = {
  clients: Client[];
};

/**
 * Render a clients management UI that shows either a data table of clients or an empty-state prompting to add the first client.
 *
 * @param clients - Array of client records to display in the table
 * @returns A React element that displays a data table of clients when `clients` is non-empty; otherwise an empty-state view with an add-client dialog restricted to admin users.
 */
export function ManageClientsTable({ clients }: props) {
  if (clients.length === 0) {
    return (
      <EmptyView
        title="No Clients Yet"
        description="Get started by adding the first client to the system."
        icon={<BriefcaseBusiness className="h-12 w-12 text-primary/80 mb-4" />}
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
        <RestrictByUserAppAttrsClient adminOnly>
          <ClientDialog />
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}