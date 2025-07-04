import { CalendarCog } from "lucide-react";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

type props = {
  perfYear: string;
};

/**
 * Displays a skeleton card UI representing a payer performance year configuration in a loading state.
 *
 * The card shows placeholder content for the performance year and key configuration fields, providing visual feedback while data is loading.
 *
 * @param perfYear - The performance year to display, or an empty string to show a skeleton placeholder.
 */
export function PayerPyConfigCardSkeleton({ perfYear }: props) {
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
            <span className="text-muted-foreground">Program:</span>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Type:</span>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Model:</span>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Physician Assignment:</span>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
