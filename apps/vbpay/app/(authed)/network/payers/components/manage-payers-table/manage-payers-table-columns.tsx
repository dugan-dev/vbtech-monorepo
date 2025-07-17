"use client";

import { NetworkPayer } from "@/routes";
import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { formatTaxId } from "@workspace/utils/format-tax-id";

import { Payer } from "@/types/payer";
import { PayerType, PayerTypeLabels } from "@/types/payer-type";
import { PerfMonthLabels, PerformanceMonth } from "@/types/perf-month";

export const ManagePayersTableColumns: ColumnDef<Payer>[] = [
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
          <NetworkPayer.Link slug={row.original.pubId}>Open</NetworkPayer.Link>
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
    accessorKey: "payerType",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <span>{PayerTypeLabels[row.original.payerType as PayerType]}</span>
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
    id: "CMS ID",
    accessorKey: "cmsId",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CMS ID" />
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
  {
    id: "Initial Performance Year/Month",
    accessorFn: (row) => {
      return `${row.initPerfYr}-${row.initPerfMo}-${PerfMonthLabels[String(row.initPerfMo) as PerformanceMonth]}`;
    },
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Initial Performance Month"
      />
    ),
    cell: ({ row }) => {
      return `${PerfMonthLabels[String(row.original.initPerfMo) as PerformanceMonth]} ${row.original.initPerfYr}`;
    },
  },
  {
    id: "Parent Organization",
    accessorKey: "parentOrgName",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Organization" />
    ),
  },

  {
    id: "Website URL",
    accessorKey: "websiteUrl",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website URL" />
    ),
  },
];
