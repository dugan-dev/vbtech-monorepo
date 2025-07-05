import { formatDate } from "@workspace/ui/lib/format-date";
import {
  NPPES_IS_SOLE_PROPRIETOR_VALUES,
  NPPES_PROVIDER_GENDER_CODE_VALUES,
  NPPES_PROVIDER_STATUS_CODE_VALUES,
} from "@/values/nppes-api-values";
import { ColumnDef } from "@tanstack/table-core";

import { Button } from "@workspace/ui/components/button";
import { ClientFormattedDate } from "@workspace/ui/components/client-formatted-date";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { stringToTitleCase } from "@workspace/ui/lib/stringToTitleCase";

import { NppesApiResponseResult } from "@/types/nppes-api-reponse";
import { NppesSoleProprietor } from "@/types/nppes-sole-proprietor";
import { TaxonomyCode, TaxonomyCodeSpecialties } from "@/types/taxonomy-codes";
import {
  AddNetworkPhysicianFormDefaultValues,
  AddNetworkPhysicianFormInput,
} from "@/app/(authed)/network/physicians/components/add-network-physician-form/add-network-physician-form-schema";

export const NppesNetworkPhysicianResultsTableColumns: ColumnDef<NppesApiResponseResult>[] =
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
        const primaryTaxonomyCode =
          row.original?.taxonomies?.find(
            (taxonomy) => taxonomy.primary === true,
          )?.code ?? "";
        const specialty =
          TaxonomyCodeSpecialties[
            primaryTaxonomyCode as TaxonomyCode
          ].toLowerCase() ?? "";
        const nppesSoleProprietor = row.original?.basic?.sole_proprietor
          ? (row.original?.basic?.sole_proprietor as NppesSoleProprietor)
          : "";
        const formData: AddNetworkPhysicianFormInput = {
          ...AddNetworkPhysicianFormDefaultValues,
          physInfo: {
            ...AddNetworkPhysicianFormDefaultValues.physInfo,
            firstName: row.original?.basic?.first_name
              ? stringToTitleCase(row.original?.basic?.first_name)
              : "",
            lastName: row.original?.basic?.last_name
              ? stringToTitleCase(row.original?.basic?.last_name)
              : "",
            npi: row.original?.number ?? "",
            credential: row.original?.basic?.credential ?? "",
            primaryTaxonomyCode,
            specialty,
            soleProprietor:
              nppesSoleProprietor === "X"
                ? ""
                : nppesSoleProprietor === "YES"
                  ? "yes"
                  : nppesSoleProprietor === "NO"
                    ? "no"
                    : "",
          },
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
      id: "Name",
      accessorKey: "name",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) => {
        const name = `${
          row?.basic?.first_name ? row?.basic.first_name + " " : ""
        }${
          row?.basic?.middle_name ? row?.basic.middle_name + " " : ""
        }${row?.basic?.last_name ? row?.basic.last_name : ""}${
          row?.basic?.name_suffix && row?.basic.name_suffix !== "--"
            ? " " + row?.basic.name_suffix
            : ""
        }`;
        return stringToTitleCase(name);
      },
      cell: ({ row }) => {
        const name = `${
          row.original?.basic?.first_name
            ? row.original.basic.first_name + " "
            : ""
        }${
          row.original?.basic?.middle_name
            ? row.original.basic.middle_name + " "
            : ""
        }${row.original?.basic?.last_name ? row.original.basic.last_name : ""}${
          row.original?.basic?.name_suffix &&
          row.original.basic.name_suffix !== "--"
            ? " " + row.original.basic.name_suffix
            : ""
        }`;
        return row.original?.basic && <span>{stringToTitleCase(name)}</span>;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      id: "Gender",
      accessorKey: "gender",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) =>
        row?.basic?.gender
          ? NPPES_PROVIDER_GENDER_CODE_VALUES.find(
              (val) => val.code === row?.basic?.gender,
            )?.display
          : "",
      cell: ({ row }) => {
        return (
          row.original &&
          row.original.basic?.gender &&
          NPPES_PROVIDER_GENDER_CODE_VALUES.find(
            (val) => val.code === row.original?.basic?.gender,
          )?.display
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
    },
    {
      id: "Individual NPI",
      accessorKey: "npi",
      enableSorting: true,
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      accessorFn: (row) => row?.number ?? "",
      cell: ({ row }) => {
        return row.original ? row.original.number : "";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Individual NPI" />
      ),
    },
    {
      id: "Sole Proprietor",
      accessorKey: "isSoleProprietor",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) =>
        row?.basic?.sole_proprietor
          ? NPPES_IS_SOLE_PROPRIETOR_VALUES.find(
              (val) => val.code === row.basic?.sole_proprietor,
            )?.display
          : "",
      cell: ({ row }) => {
        return (
          row.original?.basic?.sole_proprietor &&
          NPPES_IS_SOLE_PROPRIETOR_VALUES.find(
            (val) => val.code === row.original?.basic?.sole_proprietor,
          )?.display
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sole Proprietor" />
      ),
    },
    {
      id: "Credential",
      accessorKey: "credential",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) => row?.basic?.credential ?? "",
      cell: ({ row }) => {
        return row.original?.basic?.credential;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Credential" />
      ),
    },
    {
      id: "Primary Taxonomy",
      accessorKey: "primaryTaxonomy",
      enableSorting: true,
      sortingFn: "text",
      filterFn: "includesString",
      accessorFn: (row) =>
        row?.taxonomies && row.taxonomies[0] && row.taxonomies[0].desc,
      cell: ({ row }) => {
        return (
          row.original?.taxonomies &&
          row.original.taxonomies[0] &&
          row.original.taxonomies[0].desc
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primary Taxonomy" />
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
