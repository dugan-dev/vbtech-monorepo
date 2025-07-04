import { CalendarCog } from "lucide-react";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

type props = {
  perfYear: string;
};

/**
 * Renders a card skeleton UI for the physician performance year configuration, displaying loading placeholders until data is available.
 *
 * @param perfYear - The performance year to display in the card header. If not provided, a skeleton placeholder is shown instead.
 */
export function PhysPyConfigCardSkeleton({ perfYear }: props) {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarCog className="size-6" />
          {perfYear ? (
            <h2 className="text-2xl font-semibold">{`PY ${perfYear}`}</h2>
          ) : (
            <Skeleton className="h-8 w-24" />
          )}
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Capitation Payments:</span>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Claim Payments:</span>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Value Based Payments:</span>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
