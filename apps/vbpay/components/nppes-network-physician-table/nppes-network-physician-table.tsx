"use client";

import { DataTable } from "@workspace/ui/components/data-table/data-table";

import { NppesApiResponseResult } from "@/types/nppes-api-reponse";
import { NppesNetworkPhysicianResultsTableColumns } from "@/components/nppes-network-physician-table/nppes-network-physician-table-columns";

type props = {
  nppesResults?: NppesApiResponseResult[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleReturnFormData: (data: any) => void;
  rowsPerPage?: number;
};

export function NppesNetworkPhysicianResultsTable({
  nppesResults,
  handleReturnFormData,
  rowsPerPage = 4,
}: props) {
  return (
    <DataTable
      columns={NppesNetworkPhysicianResultsTableColumns}
      data={nppesResults ?? []}
      options={{
        initialPageSize: rowsPerPage,
        enableGlobalSearch: false,
        hideEditPagination: true,
        hidePagination: true,
        hideTableViewOptions: true,
      }}
      initialColumnVisibility={{
        "Certification Date": false,
        "Last Updated": false,
      }}
      meta={{
        returnFormData: handleReturnFormData,
      }}
      heightPercent={40}
    />
  );
}
