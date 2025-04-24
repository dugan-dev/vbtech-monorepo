"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { NetworkPhysician } from "@/types/network-physician";
import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
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
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];
const REQUIRED_USER_ROLES: UserRole[] = ["add"];

/**
 * Renders a table of network physicians or an empty state with an add physician option, depending on whether physician data is available.
 *
 * Displays an empty view with contextual messaging and an add physician interface when no physicians are present. When physicians exist, shows a data table with pagination, global search, and configurable column visibility. The add physician interface is only available to users with the required permissions.
 *
 * @param physicians - List of network physicians to display.
 * @param usersAppAttrs - User attributes used to customize empty state messaging.
 * @param pos - Position options for the add physician form.
 * @param practices - Practice options for the add physician form.
 * @param facilities - Facility options for the add physician form.
 * @param vendors - Vendor options for the add physician form.
 */
export function ManageNetworkPhysiciansTable({
  physicians,
  usersAppAttrs,
  pos,
  practices,
  facilities,
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
          allowedUserTypes={ALLOWED_USER_TYPES}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddNetworkPhysicianProvider
            pos={pos}
            practices={practices}
            facilities={facilities}
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
          allowedUserTypes={ALLOWED_USER_TYPES}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <AddNetworkPhysicianProvider
            pos={pos}
            practices={practices}
            facilities={facilities}
            vendors={vendors}
          >
            <AddNetworkPhysicianSheet />
          </AddNetworkPhysicianProvider>
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
