"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkPhysician } from "@/types/network-physician";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { AddNetworkPhysicianProvider } from "../../contexts/use-add-network-physician-context";
import { AddNetworkPhysicianSheet } from "../add-network-physician-sheet";
import { ManageNetworkPhysiciansTableColumns } from "./manage-network-physicians-table-columns";

type props = {
  physicians: NetworkPhysician[];
  usersAppAttrs: UserAppAttrs;
  pos: ComboItem[];
  pratices: ComboItem[];
  facilitites: ComboItem[];
  vendors: ComboItem[];
};

const REQUIRED_USER_ROLES: UserRole[] = ["add"];

export function ManageNetworkPhysiciansTable({
  physicians,
  usersAppAttrs,
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
          usersAppAttrs.type === "bpo"
            ? "Get started by adding your first network physician to the system."
            : "Network Entity configuration is pending. Please contact your support if you have any questions."
        }
        icon={<Icons.stethoscope className="h-12 w-12 text-gray-400 mb-4" />}
      >
        <RestrictByUserAppAttrsClient
          usersAppAttrs={usersAppAttrs}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddNetworkPhysicianProvider
            pos={pos}
            pratices={pratices}
            facilitites={facilitites}
            vendors={vendors}
          >
            <AddNetworkPhysicianSheet />
          </AddNetworkPhysicianProvider>
        </RestrictByUserAppAttrsClient>
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
      itemsAboveTable={
        <RestrictByUserAppAttrsClient
          usersAppAttrs={usersAppAttrs}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddNetworkPhysicianProvider
            pos={pos}
            pratices={pratices}
            facilitites={facilitites}
            vendors={vendors}
          >
            <AddNetworkPhysicianSheet />
          </AddNetworkPhysicianProvider>
        </RestrictByUserAppAttrsClient>
      }
      meta={{
        usersAppAttrs,
      }}
    />
  );
}
