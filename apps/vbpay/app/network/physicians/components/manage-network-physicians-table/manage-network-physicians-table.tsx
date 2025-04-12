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
  pratices: ComboItem[];
  facilitites: ComboItem[];
  vendors: ComboItem[];
};

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];
const REQUIRED_USER_ROLES: UserRole[] = ["add"];

/**
 * Renders a table of network physicians or an empty state prompting the addition of a new physician.
 *
 * When there are no physicians, an empty view is displayed with a contextual message based on the user's type.
 * Authorized users are provided an interface to add a network physician through a modal sheet.
 * If physicians are available, a data table is rendered with pagination, global search, and configurable column visibility.
 *
 * @param physicians - Array of network physician records to display.
 * @param usersAppAttrs - User attributes that determine access and influence displayed messages.
 * @param pos - List of combo items for positions used in the add physician form.
 * @param pratices - List of combo items for practices used in the add physician form.
 * @param facilitites - List of combo items for facilities used in the add physician form.
 * @param vendors - List of combo items for vendors used in the add physician form.
 */
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
          allowedUserTypes={ALLOWED_USER_TYPES}
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
