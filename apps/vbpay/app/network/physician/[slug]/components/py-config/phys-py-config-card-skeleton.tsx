import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { Icons } from "@/components/icons";

type props = {
  perfYear: string;
};

/**
 * Renders a card skeleton UI for loading physician performance year configuration data.
 *
 * Displays placeholder content for the performance year and payment categories while data is loading. If {@link perfYear} is provided, it is shown in the header; otherwise, a skeleton placeholder is displayed.
 *
 * @param perfYear - The performance year to display in the card header, if available.
 */
export function PhysPyConfigCardSkeleton({ perfYear }: props) {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.calendarCog className="size-6" />
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
