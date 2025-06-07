import "server-only";

import { getUsersData } from "@/repos/user-repository";

import { HealthPlan } from "@/types/health-plan";
import { MissingInvalidView } from "@/components/missing-invalid-view";

import { getHealthPlanPbps } from "../repos/get-health-plan-pbps";
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
  const [plansData, pbpsData] = await Promise.all([
    getHealthPlansForTable(clientPubId),
    getHealthPlanPbps(clientPubId),
  ]);

  // Map plans to add pbps to each plan to match the HealthPlan type
  const typedPlans: HealthPlan[] = plansData.map((plan) => {
    const planPbps = pbpsData.filter((pbp) => pbp.hpPubId === plan.pubId);

    // Create a properly typed HealthPlan object with pbps array
    const healthPlan = {
      ...plan,
      pbps: planPbps.map((pbp) => ({
        pbpPubId: pbp.pubId,
        pbpName: pbp.pbpName,
        pbpId: pbp.pbpId,
        isActive: Boolean(pbp.isActive),
      })),
    };

    return healthPlan;
  });

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <ManageHealthPlansTable plans={typedPlans} clientPubId={clientPubId} />
    </div>
  );
}
