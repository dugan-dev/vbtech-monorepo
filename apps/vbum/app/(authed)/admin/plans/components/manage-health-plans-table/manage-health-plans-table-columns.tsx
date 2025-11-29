"use client";

import { ColumnDef } from "@tanstack/table-core";
import { parseAsString, useQueryState } from "nuqs";

import { Badge } from "@workspace/ui/components/badge";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";

import { HealthPlan } from "@/types/health-plan";

import { HealthPlanDialog } from "../health-plan-dialog";
import { HealthPlanFormData } from "../health-plan-form/health-plan-form-schema";

export const ManageHealthPlansTableColumns: ColumnDef<HealthPlan>[] = [
  {
    id: "Status",
    accessorKey: "status",
    accessorFn: (row) => (row.isActive ? "Active" : "Inactive"),
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "destructive"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "Client Name",
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ row }) => row.original.clientName,
  },
  {
    id: "Health Plan Name",
    accessorKey: "planName",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Health Plan Name" />
    ),
  },
  {
    id: "Actions",
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader title="Actions" column={column} />
    ),
    cell: ({ row }) => {
      const plan = row.original;
      return <ActionsCell plan={plan} />;
    },
  },
];

/**
 * Render action controls for a health plan row and present an edit dialog prefilled with the plan's data and current client id.
 *
 * The dialog is initialized with the plan's `planName`, `tatExpedited`, and `tatStandard`, and is associated with the plan's `pubId` as the health plan identifier.
 *
 * @param plan - The health plan to manage; its `planName`, `tatExpedited`, `tatStandard`, and `pubId` are used to populate and identify the dialog
 */
function ActionsCell({ plan }: { plan: HealthPlan }) {
  const [cId] = useQueryState("cId", parseAsString.withDefault(""));
  const formData: HealthPlanFormData = {
    planName: plan.planName,
    tatExpedited: String(plan.tatExpedited),
    tatStandard: String(plan.tatStandard),
  };
  return (
    <div>
      <HealthPlanDialog
        clientPubId={cId}
        formData={formData}
        healthPlanPubId={plan.pubId}
      />
    </div>
  );
}