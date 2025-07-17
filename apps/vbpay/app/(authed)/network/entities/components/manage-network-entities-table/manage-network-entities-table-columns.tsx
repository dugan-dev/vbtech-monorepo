import { NetworkEntity as NetworkEntityRoute } from "@/routes";
import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { formatTaxId } from "@workspace/utils/format-tax-id";

import { NetworkEntity } from "@/types/network-entity";
import {
  NetworkEntityType,
  NetworkEntityTypeLabels,
} from "@/types/network-entity-type";

export const ManageNetworkEntitiesTableColumns: ColumnDef<NetworkEntity>[] = [
  {
    id: "Actions",
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader title="Actions" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex justify-start">
        <Button variant="secondary" size="sm" asChild>
          <NetworkEntityRoute.Link slug={row.original.pubId}>
            Open
          </NetworkEntityRoute.Link>
        </Button>
      </div>
    ),
  },
  {
    id: "Name",
    accessorKey: "marketingName",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "Type",
    accessorKey: "netEntType",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <span>
        {NetworkEntityTypeLabels[row.original.netEntType as NetworkEntityType]}
      </span>
    ),
  },
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
    id: "Org NPI",
    accessorKey: "npi",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Org NPI" />
    ),
  },
  {
    id: "Tax ID",
    accessorKey: "taxId",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tax ID" />
    ),
    cell: ({ row }) => row.original.taxId && formatTaxId(row.original.taxId),
  },
  {
    id: "Legal Business Name",
    accessorKey: "legalName",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Legal Business Name" />
    ),
  },

  {
    id: "Acronym/Nickname",
    accessorKey: "referenceName",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acronym/Nickname" />
    ),
  },
];
