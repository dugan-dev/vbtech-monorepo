
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

type props = {
  rows?: number;
};

/**
 * A skeleton loading component for the payer processing account card.
 * Displays placeholder elements while the actual data is being loaded.
 *
 * @param props - Component properties
 * @param props.rows - Number of placeholder rows to display (defaults to 3)
 * @returns A React element representing the skeleton loading UI
 */

export function PayerProcessingAccountCardSkeleton({ rows = 3 }: props) {
  return (
    <Card className="w-1/4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent className="pb-2">
          <div className="space-y-3">
            {Array.from({ length: rows }, (_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </ScrollArea>
    </Card>
  );
}
