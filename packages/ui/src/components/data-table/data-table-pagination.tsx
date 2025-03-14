import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { Button } from "../button";

interface props<TData> {
  table: Table<TData>;
  selectableRows?: boolean;
  hideEditPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  selectableRows = false,
  hideEditPagination = false,
}: props<TData>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  const availablePageSizes = [5, 10, 15, 20, 25, 30, 40, 50];
  const pageSize = table.getState().pagination.pageSize;

  if (!availablePageSizes.includes(pageSize)) {
    availablePageSizes.push(pageSize);
    availablePageSizes.sort((a, b) => a - b);
  }

  return (
    <div className="flex flex-col p-2 pt-4">
      <div className="flex items-center space-x-6 lg:space-x-8">
        {!hideEditPagination && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {availablePageSizes.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <NavigationButtons table={table} />
        </div>
      </div>
      <div className="text-muted-foreground text-sm">
        {selectableRows
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${
              table.getFilteredRowModel().rows.length
            } row(s) selected.`
          : `${table.getFilteredRowModel().rows.length} row(s) found.`}
      </div>
    </div>
  );
}

function NavigationButtons<TData>({ table }: { table: Table<TData> }) {
  return (
    <>
      <Button
        variant="outline"
        className="hidden size-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to first page</span>
        <DoubleArrowLeftIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeftIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRightIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="hidden size-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to last page</span>
        <DoubleArrowRightIcon className="size-4" />
      </Button>
    </>
  );
}
