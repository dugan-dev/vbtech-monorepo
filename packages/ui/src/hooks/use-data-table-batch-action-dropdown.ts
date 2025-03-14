import { useCallback } from "react";
import { Table } from "@tanstack/react-table";

import { downloadCSV } from "@workspace/ui/lib/utils";

interface props<TData> {
  table: Table<TData>;
  getCsvDownloadFileName?: () => string;
}

export function useDataTableBatchActionDropdown<TData>({
  table,
  getCsvDownloadFileName,
}: props<TData>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  const handleDownloadCSV = useCallback(() => {
    const headers = table
      .getAllColumns()
      .map((column) => column.id)
      .filter(
        (header) => header.toLowerCase() !== "actions" && header !== "action",
      );

    const rows = table.getRowModel().rows.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedRow = { ...row.original } as Record<string, any>;

      // Format dates
      Object.entries(formattedRow).forEach(([key, value]) => {
        if (value instanceof Date) {
          formattedRow[key] = value.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          });
        }
      });

      return formattedRow;
    });

    downloadCSV(headers, rows, getCsvDownloadFileName?.() ?? "table-export");
  }, [table, getCsvDownloadFileName]);

  const handleSelectionAction = useCallback(
    (action: string) => {
      const selectedRows = table.getSelectedRowModel().rows;
      const ids = selectedRows
        .map((row) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const original = row.original as any;
          return (
            original.capcfgPubId ?? original.clmcfgPubId ?? original.bnscfgPubId
          );
        })
        .filter(Boolean);

      return { action, ids };
    },
    [table],
  );

  return {
    handleDownloadCSV,
    handleSelectionAction,
  };
}
