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

/**
 * Props for the DataTable component.
 */
interface DataTableProps<TData, TValue> {
  /** Column definitions for the table */
  columns: ColumnDef<TData, TValue>[];
  /** Data to display in the table */
  data: TData[];
  /** Initial row selection state */
  initialRowSelection?: RowSelectionState;
  /** Initial column visibility state */
  initialColumnVisibility?: VisibilityState;
  /** Optional content to display above the table */
  itemsAboveTable?: React.ReactNode;
  /** Table configuration options */
  options: {
    /** Whether to suppress row numbers */
    suppressRowNumber?: boolean;
    /** Initial page size for pagination */
    initialPageSize?: number;
    /** Whether to enable global search functionality */
    enableGlobalSearch?: boolean;
    /** CSS class for the global search input */
    globalSearchInputClassName?: string;
    /** Whether to hide the table view options (column visibility) */
    hideTableViewOptions?: boolean;
    /** Whether to hide pagination controls */
    hidePagination?: boolean;
    /** Whether to hide pagination edit controls */
    hideEditPagination?: boolean;
    /** Whether rows are selectable */
    selectableRows?: boolean;
    /** Whether to hide items above table when rows are selected */
    hideItemsAboveOnSelection?: boolean;
  };
  /** Utility functions for table operations */
  utils?: {
    /** Function to generate CSV download filename */
    getCsvDownloadFileName?: () => string;
    /** Handler for procedure code selection submission */
    handleSelectionSubmit?: (items: DataTableProcedureCode[]) => void;
    /** Handler for approver selection submission */
    handleApproverSelectionSubmit?: (approvers: DataTableApprover[]) => void;
    /** Handler for multiple payment selection submission */
    handleMultiplePaymentSelectionSubmit?: (
      action: string,
      id: string[],
    ) => void;
  };
  /** Additional metadata for the table */
  meta?: DataTableMeta<TData>;
  /** Width percentage for the table container */
  widthPercent?: number;
  /** Height percentage for the table container */
  heightPercent?: number;
}

/**
 * A comprehensive data table component with advanced features.
 *
 * This component provides a full-featured data table with sorting, filtering,
 * pagination, row selection, global search, column visibility controls,
 * CSV export, and batch actions. It's built on top of TanStack Table and
 * integrates with React Hook Form for form-based operations.
 *
 * Features include:
 * - Sortable and filterable columns
 * - Global search functionality
 * - Row selection with batch actions
 * - Pagination with customizable page sizes
 * - Column visibility controls
 * - CSV export capability
 * - Responsive design
 * - Customizable styling
 *
 * @param props - Configuration object containing data, columns, options, and utility functions
 * @returns DataTable component with full table functionality
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   options={{
 *     enableGlobalSearch: true,
 *     selectableRows: true,
 *     initialPageSize: 10
 *   }}
 *   utils={{
 *     getCsvDownloadFileName: () => 'users.csv'
 *   }}
 * />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  initialRowSelection = {},
  initialColumnVisibility,
  itemsAboveTable,
  options,
  utils,
  meta,
  widthPercent,
  heightPercent,
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
        widthPercent={widthPercent}
        heightPercent={heightPercent}
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
