import { getHealthPlansForTable } from "@/app/(authed)/admin/plans/repos/get-health-plans-for-table";

type HealthPlanQry = NonNullable<
  Awaited<ReturnType<typeof getHealthPlansForTable>>
>[0];

export type HealthPlan = HealthPlanQry & {
  pbps: {
    pbpPubId: string;
    pbpName: string;
    pbpId: string;
    isActive: boolean;
  }[];
};
