"use client";

import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { ClientFormattedDate } from "@workspace/ui/components/client-formatted-date";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { UserCognito } from "@/types/user-cognito";
import { UserTypeLabels } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";
import { UserTypeIcon } from "@/components/user-type-icon";

import { UserManagementDropdown } from "./user-management-dropdown";

export const UserManagementTableColumns: ColumnDef<UserCognito>[] = [
  {
    id: "Created At",
    accessorKey: "createdAt",
    sortingFn: "datetime",
    enableSorting: true,
    filterFn: "includesString",
    accessorFn: (row) => row.createdAt.toLocaleString(),
    header: ({ column }) => (
      <DataTableColumnHeader title="Created At" column={column} />
    ),
    cell: ({ row }) => {
      if (!row.original.createdAt) return "N/A";
      return <ClientFormattedDate date={row.original.createdAt} />;
    },
  },
  {
    id: "Updated At",
    accessorKey: "lastUpdatedAt",
    sortingFn: "datetime",
    enableSorting: true,
    filterFn: "includesString",
    accessorFn: (row) => row.lastUpdatedAt.toLocaleString(),
    header: ({ column }) => (
      <DataTableColumnHeader title="Updated At" column={column} />
    ),
    cell: ({ row }) => {
      if (!row.original.lastUpdatedAt) return "N/A";
      return <ClientFormattedDate date={row.original.lastUpdatedAt} />;
    },
  },
  {
    id: "Name",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      return `${row.original.firstName} ${row.original.lastName}`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "Email",
    accessorKey: "email",
    enableSorting: true,
    sortingFn: "text",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: "User Type",
    accessorKey: "appAttrs.type",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Type" />
    ),
    cell: ({ row }) => {
      const userType = row.original.appAttrs.type;
      const isAdmin = row.original.appAttrs.admin;
      const isSuper = row.original.appAttrs.super;
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <UserTypeIcon userType={userType} />
            {UserTypeLabels[userType]}
          </Badge>
          {isAdmin && <Badge variant="secondary">Admin</Badge>}
          {isSuper && <Badge variant="secondary">Super</Badge>}
        </div>
      );
    },
  },
  {
    id: "Account Status",
    accessorKey: "accountStatus",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          {row.original.accountStatus}
        </Badge>
      );
    },
  },
  {
    id: "Confirmation Status",
    accessorKey: "confirmationStatus",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Confirmation Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          {row.original.confirmationStatus}
        </Badge>
      );
    },
  },
  {
    id: "Entities",
    accessorKey: "appAttrs.ids",
    enableSorting: true,
    sortingFn: "alphanumeric",
    filterFn: "includesString",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entities" />
    ),
    cell: ({ row, table }) => {
      const usersType = row.original.appAttrs.type;
      const physicians = table.options.meta?.meta
        ?.physicians as DataTablePhysician[];
      const payers = table.options.meta?.meta?.payers as ComboItem[];
      const practices = table.options.meta?.meta?.practices as ComboItem[];
      const pos = table.options.meta?.meta?.pos as ComboItem[];
      const facilities = table.options.meta?.meta?.facilities as ComboItem[];
      const vendors = table.options.meta?.meta?.vendors as ComboItem[];
      return (
        <div className="flex flex-wrap gap-2">
          {row.original.appAttrs.ids?.map((id) => {
            return (
              <HoverCard key={id.id + "hover"} openDelay={100}>
                <HoverCardTrigger>
                  <Badge
                    variant="outline"
                    key={id.id}
                    className="flex items-center gap-1"
                  >
                    <UserTypeIcon userType={usersType} />
                    {usersType === "physician"
                      ? physicians.find(
                          (physician) => physician.physPubId === id.id,
                        )?.physDisplayName
                      : usersType === "practice"
                        ? practices.find((practice) => practice.value === id.id)
                            ?.label
                        : usersType === "po"
                          ? pos.find((pos) => pos.value === id.id)?.label
                          : usersType === "facility"
                            ? facilities.find(
                                (facility) => facility.value === id.id,
                              )?.label
                            : usersType === "vendor"
                              ? vendors.find((vendor) => vendor.value === id.id)
                                  ?.label
                              : usersType === "payer" ||
                                  usersType === "bpo" ||
                                  usersType === "payers"
                                ? payers.find((payer) => payer.value === id.id)
                                    ?.label
                                : id.id}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-wrap">
                  <h1 className="font-semibold text-xl">
                    {usersType === "physician"
                      ? physicians.find(
                          (physician) => physician.physPubId === id.id,
                        )?.physDisplayName
                      : usersType === "practice"
                        ? practices.find((practice) => practice.value === id.id)
                            ?.label
                        : usersType === "po"
                          ? pos.find((pos) => pos.value === id.id)?.label
                          : usersType === "facility"
                            ? facilities.find(
                                (facility) => facility.value === id.id,
                              )?.label
                            : usersType === "vendor"
                              ? vendors.find((vendor) => vendor.value === id.id)
                                  ?.label
                              : usersType === "payer" ||
                                  usersType === "bpo" ||
                                  usersType === "payers"
                                ? payers.find((payer) => payer.value === id.id)
                                    ?.label
                                : id.id}
                  </h1>
                  <p>
                    <b>Mode:</b> {id.userMode}
                  </p>
                  <p>
                    <b>Roles:</b> {id.userRoles.join(", ")}
                  </p>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "Actions",
    accessorKey: "actions",
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader title="Actions" column={column} />
    ),
    cell: ({ row, table }) => {
      const accountStatus = row.original.accountStatus;
      const confirmationStatus = row.original.confirmationStatus;
      return (
        <RestrictByUserAppAttrsClient adminOnly>
          <UserManagementDropdown
            accountStatus={accountStatus}
            confirmationStatus={confirmationStatus}
            user={row.original}
            payers={table.options.meta?.meta?.payers as ComboItem[]}
            practices={table.options.meta?.meta?.practices as ComboItem[]}
            pos={table.options.meta?.meta?.pos as ComboItem[]}
            facilities={table.options.meta?.meta?.facilities as ComboItem[]}
            vendors={table.options.meta?.meta?.vendors as ComboItem[]}
            physicians={
              table.options.meta?.meta?.physicians as DataTablePhysician[]
            }
          />
        </RestrictByUserAppAttrsClient>
      );
    },
  },
];
