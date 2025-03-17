import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";

interface props {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  cellWidths?: string[];
  withPagination?: boolean;
  shrinkZero?: boolean;
  className?: string;
  heightPercent?: number;
  widthPercent?: number;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  cellWidths = ["auto"],
  withPagination = true,
  shrinkZero = false,
  heightPercent,
  widthPercent = 70,
  className,
  ...props
}: props) {
  return (
    <div
      className={cn("flex size-full h-fit flex-1 flex-col p-1", className)}
      {...props}
    >
      <ToolbarSkeleton
        searchableColumnCount={searchableColumnCount}
        filterableColumnCount={filterableColumnCount}
        showViewOptions={showViewOptions}
      />

      <TableContentSkeleton
        columnCount={columnCount}
        rowCount={rowCount}
        cellWidths={cellWidths}
        shrinkZero={shrinkZero}
        heightPercent={heightPercent}
        widthPercent={widthPercent}
      />

      {withPagination && <PaginationSkeleton />}
    </div>
  );
}

function ToolbarSkeleton({
  searchableColumnCount,
  filterableColumnCount,
  showViewOptions,
}: Pick<
  props,
  "searchableColumnCount" | "filterableColumnCount" | "showViewOptions"
>) {
  return (
    <div className="flex w-fit flex-row items-center gap-4 pb-4">
      {showViewOptions && <Skeleton className="mx-auto flex h-7 w-[4.5rem]" />}
      <div className="flex flex-1 items-center space-x-2">
        {Array.from({ length: searchableColumnCount ?? 0 }).map((_, i) => (
          <Skeleton key={`search-${i}`} className="h-7 w-40 md:w-96" />
        ))}
        {Array.from({ length: filterableColumnCount ?? 0 }).map((_, i) => (
          <Skeleton
            key={`filter-${i}`}
            className="h-7 w-[4.5rem] border-dashed"
          />
        ))}
      </div>
    </div>
  );
}

function TableContentSkeleton({
  columnCount,
  rowCount,
  cellWidths,
  shrinkZero,
  heightPercent,
  widthPercent = 70,
}: Pick<
  props,
  | "columnCount"
  | "rowCount"
  | "cellWidths"
  | "shrinkZero"
  | "heightPercent"
  | "widthPercent"
>) {
  const containerStyle = {
    width: `${widthPercent}dvw`,
    height: heightPercent !== undefined ? `${heightPercent}dvh` : "100%",
  };
  return (
    <div
      className="bg-card text-card-foreground overflow-scroll rounded-lg border shadow-sm"
      style={containerStyle}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead
                key={`header-${i}`}
                style={{
                  width: cellWidths?.[i],
                  minWidth: shrinkZero ? cellWidths?.[i] : "auto",
                }}
              >
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount ?? 0 }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} className="hover:bg-transparent">
              {Array.from({ length: columnCount ?? 0 }).map((_, colIndex) => (
                <TableCell
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={{
                    width: cellWidths?.[colIndex],
                    minWidth: shrinkZero ? cellWidths?.[colIndex] : "auto",
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[100px]" />
    </div>
  );
}
