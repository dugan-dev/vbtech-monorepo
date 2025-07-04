import { HeartHandshake } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Displays a skeleton card placeholder for loading affiliate information in a physician network UI.
 *
 * Renders a static card layout with labeled rows and skeleton elements to indicate loading state for affiliate details.
 */
export function PhysAffiliatesCardSkeleton() {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartHandshake className="size-6" />
          <CardTitle className="text-2xl">Affiliates</CardTitle>
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payer:</span>
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Practice:</span>
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider Org:</span>
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Facility:</span>
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Vendor:</span>
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
