import { formatDate } from "@/utils/format-date";
import { NPPES_PROVIDER_STATUS_CODE_VALUES } from "@/values/nppes-api-values";
import { ColumnDef } from "@tanstack/table-core";

import { Button } from "@workspace/ui/components/button";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { stringToTitleCase } from "@workspace/ui/lib/stringToTitleCase";

import { NppesApiResponseResult } from "@/types/nppes-api-reponse";
import { ClientFormattedDate } from "@/components/client-formatted-date";
import {
  AddNetworkEntityFormDefaultValues,
  AddNetworkEntityFormInput,
} from "@/app/network/entities/components/add-network-entity-form/add-network-entity-form-schema";

export const NppesNetworkEntityResultsTableColumns: ColumnDef<NppesApiResponseResult>[] =
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
      cell: ({ row, table }) => {
        const name = row.original?.basic?.organization_name ?? "";
        const formData: AddNetworkEntityFormInput = {
          ...AddNetworkEntityFormDefaultValues,
          orgNpi: row.original?.number ?? "",
          marketingName: stringToTitleCase(name),
        };
        return (
          <div className="flex justify-start">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (table.options.meta?.meta?.returnFormData) {
                  table.options.meta.meta.returnFormData(formData);
                }
              }}
            >
              Autofill
            </Button>
          </div>
        );
      },
    },
    {
      id: "Certification Date",
      accessorKey: "certificationDate",
      sortingFn: "datetime",
      enableSorting: true,
      filterFn: "includesString",
      accessorFn: (row) =>
        row?.basic?.certification_date
          ? formatDate({
              date: row.basic.certification_date,
            })
          : "",
      cell: ({ row }) => {
        return row.original?.basic?.certification_date ? (
          <ClientFormattedDate date={row.original.basic.certification_date} />
        ) : (
          ""
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Certification Date" />
      ),
    },
    {
      id: "Last Updated",
      accessorKey: "lastUpdated",
      enableSorting: true,
      filterFn: "includesString",
      sortingFn: "datetime",
      accessorFn: (row) =>
        row?.basic?.last_updated
          ? formatDate({ date: row.basic.last_updated })
          : "",
      cell: ({ row }) => {
        return row.original?.basic?.last_updated ? (
          <ClientFormattedDate date={row.original.basic.last_updated} />
        ) : (
          ""
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
    },
    {
      id: "Status",
      accessorKey: "status",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) =>
        row?.basic?.status
          ? NPPES_PROVIDER_STATUS_CODE_VALUES.find(
              (val) => val.code === row.basic?.status,
            )?.display
          : "",
      cell: ({ row }) => {
        return (
          row.original &&
          row.original.basic?.status &&
          NPPES_PROVIDER_STATUS_CODE_VALUES.find(
            (val) => val.code === row.original?.basic?.status,
          )?.display
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      id: "Org Name",
      accessorKey: "orgName",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) => {
        const name = row?.basic?.organization_name ?? "";
        return stringToTitleCase(name);
      },
      cell: ({ row }) => {
        const name = row?.original?.basic?.organization_name ?? "";
        return row.original?.basic && <span>{stringToTitleCase(name)}</span>;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      id: "Parent Org Legal Name",
      accessorKey: "parentOrgLegalName",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) => {
        const name = row?.basic?.parent_org_lbn ?? "";
        return stringToTitleCase(name);
      },
      cell: ({ row }) => {
        const name = row?.original?.basic?.parent_org_lbn ?? "";
        return row.original?.basic && <span>{stringToTitleCase(name)}</span>;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Parent Org Legal Name" />
      ),
    },
    {
      id: "Org NPI",
      accessorKey: "orgNpi",
      enableSorting: true,
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      accessorFn: (row) => row?.number ?? "",
      cell: ({ row }) => {
        return row.original ? row.original.number : "";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Org NPI" />
      ),
    },
    {
      id: "Primary Practice Location",
      accessorKey: "primaryPracticeLocation",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) => {
        const address = row?.addresses && row.addresses[0];
        const address1TitleCase = stringToTitleCase(address?.address_1 ?? "");
        const address2TitleCase = stringToTitleCase(address?.address_2 ?? "");
        const cityTitleCase = stringToTitleCase(address?.city ?? "");
        return `${address1TitleCase} ${
          address?.address_2 ? address2TitleCase : ""
        } ${cityTitleCase}, ${address?.state} ${
          address?.postal_code && address?.postal_code.substring(0, 5)
        }`;
      },
      cell: ({ row }) => {
        const address = row.original?.addresses && row.original.addresses[0];
        const address1TitleCase = stringToTitleCase(address?.address_1 ?? "");
        const address2TitleCase = stringToTitleCase(address?.address_2 ?? "");
        const cityTitleCase = stringToTitleCase(address?.city ?? "");
        return (
          address && (
            <div className="flex flex-col">
              <span>{address1TitleCase}</span>
              {address.address_2 && <span>{address2TitleCase}</span>}
              <span>
                {`${cityTitleCase}, ${address.state} ${address.postal_code && address.postal_code.substring(0, 5)}`}
              </span>
            </div>
          )
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Primary Practice Location"
        />
      ),
    },
  ];
