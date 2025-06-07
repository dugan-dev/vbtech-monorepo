"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";

import { HealthPlan } from "@/types/health-plan";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { EmptyView } from "@/components/empty-view";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { HealthPlanSheet } from "../health-plan-sheet";
import { ManageHealthPlansTableColumns } from "./manage-health-plans-table-columns";

const ALLOWED_USER_TYPES: UserType[] = ["internal"];

const REQUIRED_USER_ROLES: UserRole[] = ["edit"];

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
        icon={
          <Icons.heartHandshake className="h-12 w-12 text-primary/80 mb-4" />
        }
      >
        <RestrictByUserAppAttrsClient
          adminOnly
          allowedUserTypes={ALLOWED_USER_TYPES}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <HealthPlanSheet clientPubId={clientPubId} />
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
        <RestrictByUserAppAttrsClient
          adminOnly
          allowedUserTypes={ALLOWED_USER_TYPES}
          requiredUserRoles={REQUIRED_USER_ROLES}
        >
          <HealthPlanSheet clientPubId={clientPubId} />
        </RestrictByUserAppAttrsClient>
      }
    />
  );
}
