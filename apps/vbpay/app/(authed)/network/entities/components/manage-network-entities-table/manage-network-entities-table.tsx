"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";

import { NetworkEntity } from "@/types/network-entity";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { AddNetworkEntityProvider } from "../../contexts/add-network-entity-context";
import { AddNetworkEntitySheet } from "../add-network-entity-sheet";
import { ManageNetworkEntitiesTableColumns } from "./manage-network-entities-table-columns";

const REQUIRED_USER_ROLES: UserRole[] = ["add"];

type props = {
  entities: NetworkEntity[];
  usersAppAttrs: UserAppAttrs;
};

/**
 * Renders a table of network entities or an empty state with contextual messaging and an option to add a new entity, based on the presence of entities and user role.
 *
 * @param entities - The network entities to display in the table.
 * @param usersAppAttrs - Attributes describing the current user's application context, used to determine messaging and access.
 *
 * @remark
 * The option to add a network entity is only shown to users with the required role. The empty state description adapts to the user's application type.
 */
export function ManageNetworkEntitiesTable({ entities, usersAppAttrs }: props) {
  if (entities.length === 0) {
    return (
      <EmptyView
        title="No Network Entities Yet"
        description={
          usersAppAttrs.type === "bpo"
            ? "Get started by adding your first network entity to the system."
            : "Network Entity configuration is pending. Please contact your support if you have any questions."
        }
        icon={<Icons.network className="h-12 w-12 text-gray-400 mb-4" />}
      >
        <RestrictByUserAppAttrsClient requiredUserRoles={REQUIRED_USER_ROLES}>
          <AddNetworkEntityProvider>
            <AddNetworkEntitySheet />
          </AddNetworkEntityProvider>
        </RestrictByUserAppAttrsClient>
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManageNetworkEntitiesTableColumns}
      data={entities}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      initialColumnVisibility={{
        "Legal Business Name": false,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient requiredUserRoles={REQUIRED_USER_ROLES}>
          <AddNetworkEntityProvider>
            <AddNetworkEntitySheet />
          </AddNetworkEntityProvider>
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
