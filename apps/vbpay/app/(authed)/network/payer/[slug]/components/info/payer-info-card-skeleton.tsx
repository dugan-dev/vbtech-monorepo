import { HeartPulse } from "lucide-react";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Renders a skeleton card UI as a loading placeholder for payer information.
 *
 * Displays a fixed layout with a header containing an icon and skeleton elements, and a content area with labeled rows and skeleton blocks to indicate loading state for payer details.
 */
export function PayerInfoCardSkeleton() {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="size-6 text-muted-foreground/70" />
          <Skeleton className="h-7 w-40" />
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Type:</span>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">CMS ID:</span>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Initial Month/Year:</span>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
