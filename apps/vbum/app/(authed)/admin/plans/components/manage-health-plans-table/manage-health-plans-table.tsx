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
 * Render a table of health plans or an empty state and provide an admin-only dialog to add a new plan.
 *
 * When `plans` is empty, displays an empty view prompting to add the first plan; otherwise displays a data table of the provided plans. In both states, the add-new dialog is shown only to users with admin privileges.
 *
 * @param plans - Array of health plans to display.
 * @param clientPubId - Public client identifier passed to the add-new health plan dialog.
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