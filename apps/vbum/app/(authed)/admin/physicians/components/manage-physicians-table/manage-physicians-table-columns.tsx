"use client";

import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { formatCurrency } from "@workspace/utils/format-currency";

import { Physician } from "@/types/physician";

import { PhysicianDialog } from "../physician-dialog";
import { PhysicianFormData } from "../physician-form/physician-form-schema";

export const getManagePhysiciansTableColumns = (
  availableClients: ComboItem[],
): ColumnDef<Physician>[] => [
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
    id: "Name",
    accessorKey: "name",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "Clients",
    accessorKey: "clients",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clients" />
    ),
    cell: ({ row }) => {
      const selectedClients = row.original.clients.split(",");
      return (
        <div className="flex flex-wrap gap-2">
          {selectedClients.map((client) => {
            return (
              <Badge
                variant="outline"
                key={client}
                className="flex items-center gap-1"
              >
                {availableClients?.find((c) => c.value === client)?.label}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "Review Rate",
    accessorKey: "rateReview",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review Rate" />
    ),
    cell: ({ row }) => {
      const rate = formatCurrency({ value: row.original.rateReview });
      return <div>{rate}</div>;
    },
  },
  {
    id: "Deny/Withdraw Rate",
    accessorKey: "rateDenyWithdrawal",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deny/Withdraw Rate" />
    ),
    cell: ({ row }) => {
      const rate = formatCurrency({ value: row.original.rateDenyWithdrawal });
      return <div>{rate}</div>;
    },
  },
  {
    id: "P2P Rate",
    accessorKey: "rateP2p",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review P2P" />
    ),
    cell: ({ row }) => {
      const rate = formatCurrency({ value: row.original.rateP2p });
      return <div>{rate}</div>;
    },
  },
  {
    id: "Notes",
    accessorKey: "notes",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          <div className="max-w-[200px] text-ellipsis overflow-hidden">
            {row.original.notes}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 text-wrap">
          {row.original.notes}
        </HoverCardContent>
      </HoverCard>
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
      const physician = row.original;
      const formData: PhysicianFormData = {
        name: physician.name,
        clients: physician.clients.split(","),
        rateReview: physician.rateReview,
        rateDenyWithdraw: physician.rateDenyWithdrawal,
        rateP2p: physician.rateP2p,
        isActive: physician.isActive === 1 ? true : false,
        notes: physician.notes ?? "",
      };
      return (
        <div>
          <PhysicianDialog physPubId={physician.pubId} formData={formData} />
        </div>
      );
    },
  },
];
