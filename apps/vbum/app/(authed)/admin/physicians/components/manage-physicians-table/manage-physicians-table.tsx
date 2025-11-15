"use client";

import { BriefcaseBusiness } from "lucide-react";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { EmptyView } from "@workspace/ui/components/empty-view";

import { Physician } from "@/types/physician";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { usePhysicianContext } from "../../context/physician-context";
import { PhysicianDialog } from "../physician-dialog";
import { getManagePhysiciansTableColumns } from "./manage-physicians-table-columns";

type props = {
  physicians: Physician[];
};

/**
 * Render a clients management UI that shows either a data table of clients or an empty-state prompting to add the first client.
 *
 * @param clients - Array of client records to display in the table
 * @returns A React element that displays a data table of clients when `clients` is non-empty; otherwise an empty-state view with an add-client dialog restricted to admin users.
 */
export function ManagePhysiciansTable({ physicians }: props) {
  const { clients } = usePhysicianContext();

  if (physicians.length === 0) {
    return (
      <EmptyView
        title="No Physicians Yet"
        description="Get started by adding the first Physician to the system."
        icon={<BriefcaseBusiness className="h-12 w-12 text-primary/80 mb-4" />}
      >
        <RestrictByUserAppAttrsClient adminOnly>
          <PhysicianDialog />
        </RestrictByUserAppAttrsClient>
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={getManagePhysiciansTableColumns(clients || [])}
      data={physicians}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient adminOnly>
          <PhysicianDialog />
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
