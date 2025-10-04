import "server-only";

import { getUsersData } from "@/repos/user-repository";

import { MissingInvalidView } from "@workspace/ui/components/missing-invalid-view";

import { getHealthPlansForTable } from "../repos/get-health-plans-for-table";
import { ManageHealthPlansTable } from "./manage-health-plans-table/manage-health-plans-table";

type props = {
  userId: string;
  clientPubIdUrlParam?: string;
};

/**
 * Displays a table of health plans and their associated PBPs for a specified user and payer.
 *
 * If neither a payer ID URL parameter nor a user slug is available, renders a view indicating the missing payer ID.
 *
 * @param userId - The unique identifier for the user whose health plans are being managed.
 * @param clientPubIdUrlParam - Optional payer ID from the URL; if not provided, the user's slug is used.
 *
 * @returns A React element displaying the health plans table or a missing parameter view.
 */
export async function ManageHealthPlans({
  userId,
  clientPubIdUrlParam,
}: props) {
  const { usersAppAttrs } = await getUsersData({ userId });

  if (!clientPubIdUrlParam && !usersAppAttrs.slug) {
    return (
      <MissingInvalidView
        title="Missing Payer ID Search Parameter"
        description="The Payer ID search parameter is missing. Please try again. If the problem persists please contact support."
      />
    );
  }

  const clientPubId = clientPubIdUrlParam || usersAppAttrs.slug!;

  // Fetch health plans and PBPs
  const plansData = await getHealthPlansForTable(clientPubId);

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <ManageHealthPlansTable plans={plansData} clientPubId={clientPubId} />
    </div>
  );
}
