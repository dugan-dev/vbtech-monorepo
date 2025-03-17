import { NetworkPhysician as NetworkPhysicianRoute } from "@/routes";
import { ColumnDef } from "@tanstack/table-core";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { formatTaxId } from "@workspace/ui/lib/formatTaxId";

import { NetworkPhysician } from "@/types/network-physician";
import {
  NetworkPhysicianClassLabels,
  NetworkPhysicianClassType,
} from "@/types/network-physician-class";
import {
  NetworkPhysicianSpecialty,
  NetworkPhysicianSpecialtyLabels,
} from "@/types/network-physician-specialty";
import {
  NetworkPhysicianType,
  NetworkPhysicianTypeLabels,
} from "@/types/network-physician-type";
import {
  TaxonomyCode,
  TaxonomyCodeDefinitions,
  TaxonomyCodeDisplayNames,
} from "@/types/taxonomy-codes";

export const ManageNetworkPhysiciansTableColumns: ColumnDef<NetworkPhysician>[] =
  [
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
            <NetworkPhysicianRoute.Link slug={row.original.pubId}>
              Open
            </NetworkPhysicianRoute.Link>
          </Button>
        </div>
      ),
    },

    {
      id: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      id: "Individual NPI",
      accessorKey: "npi",
      enableSorting: true,
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Individual NPI" />
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
      id: "Type",
      accessorKey: "type",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <span>
          {
            NetworkPhysicianTypeLabels[
              row.original.type as NetworkPhysicianType
            ]
          }
        </span>
      ),
    },
    {
      id: "Class",
      accessorKey: "class",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }) => (
        <span>
          {
            NetworkPhysicianClassLabels[
              row.original.class as NetworkPhysicianClassType
            ]
          }
        </span>
      ),
    },
    {
      id: "Sole Proprietor",
      accessorKey: "soleProprietor",
      accessorFn: (row) => (row.soleProprietor === 1 ? "Yes" : "No"),
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sole Proprietor" />
      ),
      cell: ({ row }) => (
        <span>{row.original.soleProprietor === 1 ? "Yes" : "No"}</span>
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
      id: "Primary Taxonomy",
      accessorFn: (row) => row.primaryTaxonomyCode,
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primary Taxonomy" />
      ),
      cell: ({ row }) =>
        row.original.primaryTaxonomyCode && (
          <HoverCard>
            <HoverCardTrigger className="hover:cursor-pointer hover:underline">
              {`${TaxonomyCodeDisplayNames[row.original.primaryTaxonomyCode as TaxonomyCode]} (${row.original.primaryTaxonomyCode})`}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <strong>
                {`${TaxonomyCodeDisplayNames[row.original.primaryTaxonomyCode as TaxonomyCode]} (${row.original.primaryTaxonomyCode})`}
              </strong>
              <br />
              {
                TaxonomyCodeDefinitions[
                  row.original.primaryTaxonomyCode as TaxonomyCode
                ]
              }
            </HoverCardContent>
          </HoverCard>
        ),
    },
    {
      id: "Specialty",
      accessorKey: "specialty",
      enableSorting: true,
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Specialty" />
      ),
      cell: ({ row }) =>
        row.original.specialty &&
        NetworkPhysicianSpecialtyLabels[
          row.original.specialty as NetworkPhysicianSpecialty
        ],
    },
    {
      id: "Credential",
      accessorKey: "credential",
      enableSorting: true,
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Credential" />
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
  ];
