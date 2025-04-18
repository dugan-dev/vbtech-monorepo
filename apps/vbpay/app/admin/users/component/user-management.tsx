import "server-only";

import { getAllNetworkEntities } from "@/repos/network-entity-repository";
import { getAllNetworkPhysicians } from "@/repos/network-physician-repository";
import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";
import { formatPhysicianNameNpi } from "@/utils/format-physician-name-and-npi";

import { getAllUsers } from "../repos/user-management-repository";
import { getLastUserSync } from "../repos/user-sync-repository";
import { filterEntitiesByType } from "../utils/filter-entities-by-type";
import { UserManagementTable } from "./user-management-table/user-management-table";

type props = {
  userId: string;
};

/**
 * Asynchronously fetches and prepares user management data, then renders the user management table UI.
 *
 * Retrieves network entities, payers, physicians, users, user-specific attributes, and the last user synchronization timestamp. The data is filtered and formatted for display and passed to the {@link UserManagementTable} component.
 *
 * @param userId - The public ID of the user whose data and attributes are to be displayed.
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
    </div>
  );
}
