import "server-only";

import { Suspense } from "react";
import { getAllNetworkEntities } from "@/repos/network-entity-repository";
import { getAllNetworkPhysicians } from "@/repos/network-physician-repository";
import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";
import { formatPhysicianNameNpi } from "@/utils/format-physician-name-and-npi";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { getAllUsers } from "../repos/user-management-repository";
import { getLastUserSync } from "../repos/user-sync-repository";
import { filterEntitiesByType } from "../utils/filter-entities-by-type";
import { UserManagementTable } from "./user-management-table/user-management-table";

type props = {
  userId: string;
};

/**
 * Asynchronously fetches and displays user management data.
 *
 * The component concurrently retrieves network entities, payers, network physicians, users, user-specific attributes, and the latest synchronization data. It then processes the data by filtering entities into practices, points of service, facilities, and vendors, and formats payer and physician information for UI consumption. The resulting data is rendered within a table component inside a Suspense wrapper that displays a loading skeleton until the data is ready.
 *
 * @param userId - The unique identifier of the user whose data is to be managed.
 *
 * @returns A React element representing the user management interface.
 */
export async function UserManagement({ userId }: props) {
  // Get all the data we need
  const [entities, payers, physicians, users, { usersAppAttrs }, lastUserSync] =
    await Promise.all([
      getAllNetworkEntities(),
      getAllPayers(),
      getAllNetworkPhysicians(),
      getAllUsers(),
      getUsersData({ userId }),
      getLastUserSync(),
    ]);

  // Filter the entities into the different types and map them to the format we need for the UI
  const practices = filterEntitiesByType(entities, "prac");
  const pos = filterEntitiesByType(entities, "po");
  const facilities = filterEntitiesByType(entities, "facl");
  const vendors = filterEntitiesByType(entities, "vendor");
  const payersCombo = payers.map((payer) => ({
    label: formatMarketingAndRefName(payer.marketingName, payer.referenceName),
    value: payer.pubId,
  }));
  const physiciansCombo = physicians.map((physician) => ({
    physDisplayName: formatPhysicianNameNpi(
      physician.firstName,
      physician.lastName,
      physician.npi,
    ),
    physPubId: physician.pubId,
    physType: physician.type,
  }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <UserManagementTable
          users={users}
          usersAppAttrs={usersAppAttrs}
          practices={practices}
          pos={pos}
          facilities={facilities}
          vendors={vendors}
          payers={payersCombo}
          physicians={physiciansCombo}
          lastUserSync={lastUserSync?.lastSyncAt}
        />
      </Suspense>
    </div>
  );
}
