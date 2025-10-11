"use client";

import { HeartHandshake } from "lucide-react";

import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { EmptyView } from "@workspace/ui/components/empty-view";

import { HealthPlan } from "@/types/health-plan";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { HealthPlanDialog } from "../health-plan-dialog";
import { ManageHealthPlansTableColumns } from "./manage-health-plans-table-columns";

type props = {
  plans: HealthPlan[];
  clientPubId: string;
};

/**
 * Displays a table of health plans or an empty state with an option to add a new plan.
 *
 * Renders a data table of health plans if any exist; otherwise, shows an empty state encouraging users to add the first plan. The option to add a new health plan is only available to users with admin privileges, the "internal" user type, and the "edit" role.
 *
 * @param plans - The list of health plans to display.
 * @param clientPubId - The public identifier for the client, used when adding a new health plan.
 */
export function ManageHealthPlansTable({ plans, clientPubId }: props) {
  if (plans.length === 0) {
    return (
      <EmptyView
        title="No Health Plans Yet"
        description="Get started by adding the first health plan to the system."
        icon={<HeartHandshake className="h-12 w-12 text-primary/80 mb-4" />}
      >
        <RestrictByUserAppAttrsClient adminOnly>
          <HealthPlanDialog clientPubId={clientPubId} />
        </RestrictByUserAppAttrsClient>
      </EmptyView>
    );
  }

  return (
    <DataTable
      columns={ManageHealthPlansTableColumns}
      data={plans}
      options={{
        initialPageSize: 10,
        enableGlobalSearch: true,
      }}
      itemsAboveTable={
        <RestrictByUserAppAttrsClient adminOnly>
          <HealthPlanDialog clientPubId={clientPubId} />
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
