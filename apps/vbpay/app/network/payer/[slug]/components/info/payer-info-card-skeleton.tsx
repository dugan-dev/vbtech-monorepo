import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Renders a skeleton loading state for a payer information card.
 *
 * This component displays a placeholder UI that mimics the structure of a payer information card while data is being loaded.
 * It features a header with placeholder elements for a title and avatar, a scrollable content area with multiple rows of text skeletons,
 * and a footer skeleton element.
 */

type props = {
  rows?: number;
};

export function PayerInfoCardSkeleton({ rows = 3 }: props) {
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
