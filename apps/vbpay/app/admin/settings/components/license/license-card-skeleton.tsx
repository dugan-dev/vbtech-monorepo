import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Renders a skeleton placeholder card for license information.
 *
 * The component displays a card that mimics the layout of the license details while data is loading.
 * It features a header with the title "License Info" and a skeleton icon, and a scrollable content area
 * containing a grid of eight placeholder rows to simulate the appearance of loading data.
 */
export function LicenseCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>License Info</CardTitle>
          <Skeleton className="h-9 w-9" />
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-2 pb-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
