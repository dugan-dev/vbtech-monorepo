"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkPhysician } from "@/types/network-physician";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";

import { AddNetworkPhysicianProvider } from "../../contexts/use-add-network-physician-context";
import { AddNetworkPhysicianSheet } from "../add-network-physician-sheet";
import { ManageNetworkPhysiciansTableColumns } from "./manage-network-physicians-table-columns";

type props = {
  physicians: NetworkPhysician[];
  usersType: UserType;
  pos: ComboItem[];
  pratices: ComboItem[];
  facilitites: ComboItem[];
  vendors: ComboItem[];
};

export function ManageNetworkPhysiciansTable({
  physicians,
  usersType,
  pos,
  pratices,
  facilitites,
  vendors,
}: props) {
  if (physicians.length === 0) {
    return (
      <EmptyView
        title="No Network Physicians Yet"
        description={
          usersType === "bpo"
            ? "Get started by adding your first network physician to the system."
            : "Network Entity configuration is pending. Please contact your support if you have any questions."
        }
        icon={<Icons.stethoscope className="h-12 w-12 text-gray-400 mb-4" />}
      >
        {/* <UserIsClient usersType={usersType} userType="bpo"> */}
        <AddNetworkPhysicianProvider
          pos={pos}
          pratices={pratices}
          facilitites={facilitites}
          vendors={vendors}
        >
          <AddNetworkPhysicianSheet />
        </AddNetworkPhysicianProvider>
        {/* </UserIsClient> */}
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManageNetworkPhysiciansTableColumns}
      data={physicians}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      initialColumnVisibility={{
        "Tax ID": false,
        Credential: false,
        "Org NPI": false,
      }}
      // TODO: Add userIsBpo check
      itemsAboveTable={
        <AddNetworkPhysicianProvider
          pos={pos}
          pratices={pratices}
          facilitites={facilitites}
          vendors={vendors}
        >
          <AddNetworkPhysicianSheet />
        </AddNetworkPhysicianProvider>
      }
      meta={{
        usersType,
      }}
    />
  );
}
