"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

/**
 * Renders a global error page.
 *
 * Displays an error message along with an optional error identifier and provides two user actions:
 * one to retry via the provided reset callback and another to navigate back using the Next.js router.
 * The component wraps its content in <html> and <body> tags as required for global error pages.
 *
 * @param error - The error object containing the error message and an optional digest for additional error context.
 * @param reset - Callback function to reset the error state, typically used to retry the failed operation.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <AlertCircle className="h-10 w-10 text-destructive" />
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
                The application encountered an error. You can try again or
                contact support if the problem persists.
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
      </body>
    </html>
  );
}
