import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { useDataTableBatchActionDropdown } from "@workspace/ui/hooks/use-data-table-batch-action-dropdown";
import {
  DataTableApprover,
  DataTableMeta,
  DataTableProcedureCode,
} from "@workspace/ui/types/data-table-types";

interface props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialRowSelection?: RowSelectionState;
  initialColumnVisibility?: VisibilityState;
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

export function useDataTable<TData, TValue>({
  columns,
  data,
  initialRowSelection,
  initialColumnVisibility,
  options,
  utils,
  meta,
}: props<TData, TValue>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);
    // Store the itemRank info
    addMeta({ itemRank });
    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: options.selectableRows,
    enableGlobalFilter: options.enableGlobalSearch,
    filterFns: {
      fuzzyFilter: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    initialState: {
      pagination: { pageSize: options.initialPageSize },
      columnVisibility: initialColumnVisibility,
      rowSelection: initialRowSelection || {},
    },
    meta: {
      meta,
    },
  });

  const { handleDownloadCSV } = useDataTableBatchActionDropdown({
    table,
    getCsvDownloadFileName: utils?.getCsvDownloadFileName,
  });

  // Handle selection submit
  const handleSubmit = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstRow = selectedRows?.[0]?.original as any;
    if ("procCode" in firstRow) {
      utils?.handleSelectionSubmit?.(
        selectedRows.map((row) => {
          const original = row.original as {
            procCode: string;
            description: string;
            procCodeType: string;
            ffsPct: string;
            ffsPctAdjMethod: string;
          };
          return {
            procCode: original.procCode,
            description: original.description,
            procCodeType: original.procCodeType,
            ffsPct: original.ffsPct,
            ffsPctAdjMethod: original.ffsPctAdjMethod,
          };
        }),
      );
    } else {
      utils?.handleApproverSelectionSubmit?.(
        selectedRows.map((row) => {
          const original = row.original as {
            userId: string;
            firstName: string;
            lastName: string;
            email: string;
            isRequired: number;
          };
          return {
            userId: original.userId,
            firstName: original.firstName,
            lastName: original.lastName,
            email: original.email,
            isRequired: original.isRequired,
          };
        }),
      );
    }
  };

  return {
    table,
    handleDownloadCSV,
    handleSubmit,
  };
}
