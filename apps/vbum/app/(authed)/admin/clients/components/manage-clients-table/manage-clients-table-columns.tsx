"use client";

import { timezones } from "@/values/timezones";
import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";

import { Client } from "@/types/client";

import { ClientDialog } from "../client-dialog";
import { ClientFormData } from "../client-form/client-form-schema";

export const ManageClientsTableColumns: ColumnDef<Client>[] = [
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
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
  },
  {
    id: "Client Code",
    accessorKey: "clientCode",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Code" />
    ),
  },
  {
    id: "Timezone",
    accessorKey: "timezone",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timezone" />
    ),
    cell: ({ row }) => {
      const timezoneDisplayName = timezones.find(
        (tz) => tz.value === row.original.timezone,
      )?.label;
      return <div>{timezoneDisplayName}</div>;
    },
  },
  {
    id: "Description",
    accessorKey: "description",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          <div className="max-w-[200px] text-ellipsis overflow-hidden">
            {row.original.description}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 text-wrap">
          {row.original.description}
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
      const client = row.original;
      const formData: ClientFormData = {
        clientName: client.clientName,
        clientCode: client.clientCode,
        timezone: client.timezone,
        description: client.description,
      };
      return (
        <div>
          <ClientDialog clientPubId={client.pubId} formData={formData} />
        </div>
      );
    },
  },
];
