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
 * Render action controls for a health plan row and open an edit dialog populated with the plan.
 *
 * Uses the current "cId" query-state value as `clientPubId` and supplies initial form data derived from `plan` to HealthPlanDialog.
 *
 * @param plan - The health plan row to manage; its `planName` and `pubId` are used to populate the dialog.
 */
function ActionsCell({ plan }: { plan: HealthPlan }) {
  const [cId] = useQueryState("cId", parseAsString.withDefault(""));
  const formData: HealthPlanFormData = {
    planName: plan.planName,
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