import type { Table } from "@tanstack/react-table";

import { DebouncedInput } from "@workspace/ui/components/debounced-input";

interface props<TData> {
  table: Table<TData>;
  searchInputClassName?: string;
}

export function DataTableGlobalSearch<TData>({
  table,
  searchInputClassName,
}: props<TData>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  return (
    <DebouncedInput
      placeholder="Search all columns"
      value={table.getState().globalFilter ?? ""}
      onChange={(value) => table.setGlobalFilter(String(value))}
      className={searchInputClassName ?? "md:w-96 bg-card"}
      id="search-all-columns"
    />
  );
}
