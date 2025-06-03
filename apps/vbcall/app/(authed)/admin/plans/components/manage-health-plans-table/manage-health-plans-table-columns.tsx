"use client";

import { ColumnDef } from "@tanstack/table-core";
import { parseAsString, useQueryState } from "nuqs";

import { Badge } from "@workspace/ui/components/badge";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { formatPhoneNumber } from "@workspace/ui/lib/formatPhoneNumber";

import { HealthPlan } from "@/types/health-plan";

import { HealthPlanFormData } from "../health-plan-form/health-plan-form-schema";
import { HealthPlanSheet } from "../health-plan-sheet";

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
    id: "Health Plan ID",
    accessorKey: "planId",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Health Plan ID" />
    ),
  },
  {
    id: "Phone Number",
    accessorKey: "phoneNumber",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => {
      return <div>{formatPhoneNumber(row.original.phoneNumber)}</div>;
    },
  },
  {
    id: "Fax Number",
    accessorKey: "faxNumber",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fax Number" />
    ),
    cell: ({ row }) => {
      return <div>{formatPhoneNumber(row.original.faxNumber)}</div>;
    },
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

function ActionsCell({ plan }: { plan: HealthPlan }) {
  const [cId] = useQueryState("cId", parseAsString.withDefault(""));
  const formData: HealthPlanFormData = {
    planName: plan.planName,
    planId: plan.planId,
    phoneNumber: plan.phoneNumber,
    faxNumber: plan.faxNumber,
    pbps: plan.pbps,
  };
  return (
    <div>
      <HealthPlanSheet
        clientPubId={cId}
        formData={formData}
        pubId={plan.pubId}
      />
    </div>
  );
}
