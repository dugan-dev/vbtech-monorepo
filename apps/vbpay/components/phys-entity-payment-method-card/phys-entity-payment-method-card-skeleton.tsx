import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { Icons } from "@/components/icons";

/**
 * Renders a skeleton card placeholder for the "Bank Accounts" payment method section.
 *
 * Displays a loading UI with a card layout, including a header and a table with skeleton rows to simulate the loading state of bank account data.
 */
export function PhysEntityPaymentMethodCardSkeleton() {
  return (
    <Card className="min-w-[450px] w-1/3 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.landmark className="size-6" />
          <CardTitle className="text-2xl">Bank Accounts</CardTitle>
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Bank</TableHead>
                <TableHead className="w-1/4">Type</TableHead>
                <TableHead className="w-1/4">Account #</TableHead>
                <TableHead className="w-1/4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Skeleton className="h-6 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
