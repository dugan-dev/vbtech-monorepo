"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Icons } from "@/components/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Icons.alertCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-xl text-center">Error</CardTitle>
          <CardDescription className="text-center">
            {error?.message || "An error occurred while loading this page"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error?.digest && (
            <p className="text-xs text-muted-foreground font-mono text-center mb-2">
              Error ID: {error.digest}
            </p>
          )}
          <p className="text-muted-foreground text-center">
            The application encountered an error. You can try again or contact
            support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
