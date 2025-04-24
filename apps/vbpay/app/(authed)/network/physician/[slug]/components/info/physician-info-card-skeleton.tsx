import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { Icons } from "@/components/icons";

/**
 * Displays a skeleton placeholder card representing physician information while data is loading.
 *
 * Renders labeled skeleton fields for "Individual NPI," "Class," "Type," and "Credential" within a styled card layout.
 */
export function PhysicianInfoCardSkeleton() {
  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.stethoscope className="size-6" />
          <CardTitle className="text-2xl">
            <Skeleton className="h-7 w-48" />
          </CardTitle>
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-10 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Individual NPI:</span>
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Class:</span>
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <Skeleton className="h-5 w-36" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Credential:</span>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
