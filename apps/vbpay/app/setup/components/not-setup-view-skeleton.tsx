import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { Icons } from "@/components/icons";

export function NotSetupViewSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          License Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Icons.alertCircle className="h-4 w-4" />
          <AlertTitle>No License Configured</AlertTitle>
          <AlertDescription>
            <Skeleton className="h-4 w-full my-1" />
            <Skeleton className="h-4 w-3/4 my-1" />
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
