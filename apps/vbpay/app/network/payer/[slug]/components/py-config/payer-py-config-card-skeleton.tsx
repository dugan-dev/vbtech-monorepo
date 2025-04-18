import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { Icons } from "@/components/icons";

type props = {
  perfYear: string;
};

export function PayerPyConfigCardSkeleton({ perfYear }: props) {
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
