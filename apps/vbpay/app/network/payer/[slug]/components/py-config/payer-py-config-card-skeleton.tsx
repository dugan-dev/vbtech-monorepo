import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Renders a skeleton loading card for payment configuration.
 *
 * This component displays a placeholder card with a header, scrollable content area, and footer. The header
 * contains skeleton elements simulating a title and an avatar, while the content area includes multiple rows
 * of skeletons representing text lines. The full-width skeleton in the footer completes the layout, offering a
 * visual cue during data loading.
 *
 * @returns A JSX element representing the skeleton loading card.
 */
export function PayerPyConfigCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <ScrollArea className="overflow-y-auto pr-4">
        <CardContent className="pb-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </ScrollArea>
    </Card>
  );
}
