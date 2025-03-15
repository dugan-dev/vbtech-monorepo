import { flexRender, Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

interface props<TData> {
  table: TableType<TData>;
  suppressRowNumber?: boolean;
}

export function DataTableTable<TData>({
  table,
  suppressRowNumber = false,
}: props<TData>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  return (
    <div className="bg-card text-card-foreground size-full overflow-scroll rounded-lg border shadow-sm max-w-[80dvw]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {!suppressRowNumber && <TableHead>#</TableHead>}
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {!suppressRowNumber && (
                  <TableCell key={`row-${index}`}>
                    <span className="text-muted-foreground text-xs font-medium">
                      {index + 1}
                    </span>
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
