"use client";

import {
  ColumnDef,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { DataTableBatchActionDropdown } from "@workspace/ui/components/data-table/data-table-batch-action-dropdown";
import { DataTableGlobalSearch } from "@workspace/ui/components/data-table/data-table-global-search";
import { DataTablePagination } from "@workspace/ui/components/data-table/data-table-pagination";
import { DataTableTable } from "@workspace/ui/components/data-table/data-table-table";
import { DataTableViewOptions } from "@workspace/ui/components/data-table/data-table-view-option";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useDataTable } from "@workspace/ui/hooks/use-data-table";
import {
  DataTableApprover,
  DataTableMeta,
  DataTableProcedureCode,
} from "@workspace/ui/types/data-table-types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialRowSelection?: RowSelectionState;
  initialColumnVisibility?: VisibilityState;
  itemsAboveTable?: React.ReactNode;
  options: {
    suppressRowNumber?: boolean;
    initialPageSize?: number;
    enableGlobalSearch?: boolean;
    globalSearchInputClassName?: string;
    hideTableViewOptions?: boolean;
    hidePagination?: boolean;
    hideEditPagination?: boolean;
    selectableRows?: boolean;
    hideItemsAboveOnSelection?: boolean;
  };
  utils?: {
    getCsvDownloadFileName?: () => string;
    handleSelectionSubmit?: (items: DataTableProcedureCode[]) => void;
    handleApproverSelectionSubmit?: (approvers: DataTableApprover[]) => void;
    handleMultiplePaymentSelectionSubmit?: (
      action: string,
      id: string[],
    ) => void;
  };
  meta?: DataTableMeta<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialRowSelection = {},
  initialColumnVisibility,
  itemsAboveTable,
  options,
  utils,
  meta,
}: DataTableProps<TData, TValue>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  const { table, handleSubmit, handleDownloadCSV } = useDataTable<
    TData,
    TValue
  >({
    columns,
    data,
    initialRowSelection,
    initialColumnVisibility,
    options,
    utils,
    meta,
  });

  return (
    <div className="flex size-full flex-col p-1">
      <div className="flex w-fit flex-row items-center gap-4">
        {/* Toolbar Section */}
        {(!options.hideTableViewOptions ||
          options.enableGlobalSearch ||
          itemsAboveTable) && (
          <div className="flex w-fit flex-row items-center gap-4 pb-4">
            {!options.hideTableViewOptions && (
              <DataTableViewOptions table={table} />
            )}
            {options.enableGlobalSearch && (
              <DataTableGlobalSearch
                table={table}
                searchInputClassName={options.globalSearchInputClassName}
              />
            )}
            {utils?.handleMultiplePaymentSelectionSubmit &&
              table.getSelectedRowModel().rows.length > 0 && (
                <DataTableBatchActionDropdown
                  table={table}
                  onAction={utils?.handleMultiplePaymentSelectionSubmit}
                />
              )}
            {
              /* show items above if there are any and hiding on selection is not enabled */
              itemsAboveTable &&
                !options.hideItemsAboveOnSelection &&
                itemsAboveTable
            }
            {
              /* show items above if there are any and hiding on selection is enabled and there is no selection */
              itemsAboveTable &&
                options.hideItemsAboveOnSelection &&
                !table.getState().rowSelection &&
                itemsAboveTable
            }
          </div>
        )}

        {/* Selection Submit Button */}
        {(utils?.handleSelectionSubmit ||
          utils?.handleApproverSelectionSubmit) &&
          options.selectableRows && (
            <>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={table.getSelectedRowModel().rows.length === 0}
              >
                Submit
              </Button>
              {meta?.deleteAllSelectedProcedureCodes &&
                table.getSelectedRowModel().rows.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {table.getSelectedRowModel().rows.length} procedure code
                    {table.getSelectedRowModel().rows.length > 1 && "s"}{" "}
                    selected
                  </span>
                )}
            </>
          )}

        {/* CSV Download Button */}
        {utils?.getCsvDownloadFileName && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDownloadCSV}>
                <Download className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download CSV</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Table */}
      <DataTableTable
        table={table}
        suppressRowNumber={options.suppressRowNumber}
      />

      {/* Pagination */}
      {!options.hidePagination && (
        <DataTablePagination
          table={table}
          selectableRows={options.selectableRows}
          hideEditPagination={options.hideEditPagination}
        />
      )}
    </div>
  );
}
