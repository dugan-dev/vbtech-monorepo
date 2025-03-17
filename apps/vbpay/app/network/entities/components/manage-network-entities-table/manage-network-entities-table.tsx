"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";

import { NetworkEntity } from "@/types/network-entity";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";

import { AddNetworkEntityProvider } from "../../contexts/add-network-entity-context";
import { AddNetworkEntitySheet } from "../add-network-entity-sheet";
import { ManageNetworkEntitiesTableColumns } from "./manage-network-entities-table-columns";

type props = {
  entities: NetworkEntity[];
  usersType: UserType;
};

export function ManageNetworkEntitiesTable({ entities, usersType }: props) {
  if (entities.length === 0) {
    return (
      <EmptyView
        title="No Network Entities Yet"
        description={
          usersType === "bpo"
            ? "Get started by adding your first network entity to the system."
            : "Network Entity configuration is pending. Please contact your support if you have any questions."
        }
        icon={<Icons.network className="h-12 w-12 text-gray-400 mb-4" />}
      >
        {/* TODO: Add userType check. */}
        {/* <UserIsClient usersType={usersType} userType="bpo"> */}
        <AddNetworkEntityProvider>
          <AddNetworkEntitySheet />
        </AddNetworkEntityProvider>
        {/* </UserIsClient> */}
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
      // TODO: Add userType check.
      itemsAboveTable={
        <AddNetworkEntityProvider>
          <AddNetworkEntitySheet />
        </AddNetworkEntityProvider>
      }
      meta={{
        usersType,
      }}
    />
  );
}
