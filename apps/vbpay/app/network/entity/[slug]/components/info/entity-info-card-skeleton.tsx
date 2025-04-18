import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function EntityInfoCardSkeleton() {
  return (
    <Card className="min-w-[450px] w-1/3 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <CardTitle className="text-2xl">
            <Skeleton className="h-7 w-64" />
          </CardTitle>
          <div className="relative ml-auto">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Org NPI:</span>
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ID:</span>
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
