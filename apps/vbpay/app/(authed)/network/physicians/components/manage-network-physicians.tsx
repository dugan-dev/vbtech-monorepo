import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";
import { networkEntitiesToFormCombos } from "@/utils/network-entities-to-form-combos";

import { MissingInvalidView } from "@workspace/ui/components/missing-invalid-view";

import { getNetworkEntitiesForAffiliation } from "../repos/get-network-entities-for-affiliation";
import { getNetworkPhysiciansForTable } from "../repos/get-network-physicians-for-table";
import { ManageNetworkPhysiciansTable } from "./manage-network-physicians-table/manage-network-physicians-table";

type props = {
  payerIdUrlParam?: string;
  userId: string;
};

/**
 * Renders the Manage Network Physicians view, displaying a table of network physicians and related entities for a selected payer.
 *
 * If the payer ID is missing or invalid, displays an appropriate error view instead of the table.
 *
 * @param payerIdUrlParam - Optional payer ID from the URL to select the payer context.
 * @param userId - The user ID used to fetch user-specific application attributes.
 *
 * @returns A React element displaying the network physicians table or an error view if the payer ID is missing or invalid.
 */
export async function ManageNetworkPhysicians({
  payerIdUrlParam,
  userId,
}: props) {
  const [payers, { usersAppAttrs }] = await Promise.all([
    getAllPayers(),
    getUsersData({ userId }),
  ]);

  if (!payerIdUrlParam && !usersAppAttrs.slug) {
    return (
      <MissingInvalidView
        title="Missing Payer ID Search Parameter"
        description="The Payer ID search parameter is missing. Please try again. If the problem persists please contact support."
      />
    );
  }

  const selectedPayer = payerIdUrlParam
    ? (payerIdUrlParam as string)
    : usersAppAttrs.slug;
  const isPayerIdValid = payers.some((payer) => payer.pubId === selectedPayer);

  if (!isPayerIdValid) {
    return (
      <MissingInvalidView
        title="Invalid Payer ID Search Parameter"
        description="The provided Payer ID is invalid. Please try again. If the problem persists please contact support."
      />
    );
  }

  const [physicians, entities] = await Promise.all([
    getNetworkPhysiciansForTable({
      selectedPayer: payerIdUrlParam ?? usersAppAttrs.slug ?? "",
    }),
    getNetworkEntitiesForAffiliation({
      selectedPayer: payerIdUrlParam ?? usersAppAttrs.slug ?? "",
    }),
  ]);

  const { pos, practices, facilities, vendors } = networkEntitiesToFormCombos({
    entities,
  });

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <ManageNetworkPhysiciansTable
        physicians={physicians}
        usersAppAttrs={usersAppAttrs}
        pos={pos}
        practices={practices}
        facilities={facilities}
        vendors={vendors}
      />
    </div>
  );
}
