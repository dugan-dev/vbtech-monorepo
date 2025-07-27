"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";

type RateLimitCardProps = {
  retryIn: number;
  maxDuration?: number; // The total block duration for consistent progress calculation
};

/**
 * Renders a card indicating the user has exceeded the rate limit and shows a countdown timer.
 *
 * This component displays a countdown that starts at the provided retry duration (retryIn) and decreases
 * every second. The progress bar uses a consistent maxDuration to ensure smooth progress across page refreshes.
 * Until the countdown completes, the action button remains disabled.
 *
 * @param retryIn - The initial number of seconds the user must wait before proceeding.
 * @param maxDuration - The total block duration for consistent progress calculation (defaults to 60 seconds)
 * @returns A JSX element representing the rate limit notification card.
 */
export function RateLimitCard({
  retryIn,
  maxDuration = 60,
}: RateLimitCardProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(retryIn);
  const [isCountdownComplete, setIsCountdownComplete] = useState(retryIn <= 0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSecondsRemaining(retryIn);
    setIsCountdownComplete(retryIn <= 0);
  }, [retryIn]);

  useEffect(() => {
    // Start countdown
    if (secondsRemaining <= 0) {
      setIsCountdownComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const newValue = prev - 1;
        // Add a small buffer to account for server/client time differences
        if (newValue <= -2) {
          setIsCountdownComplete(true);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Calculate progress based on the consistent maxDuration
  // This ensures the progress bar doesn't reset on page refresh
  const progress = Math.max(
    0,
    ((maxDuration - secondsRemaining) / maxDuration) * 100,
  );

  const handleBack = async () => {
    setIsRefreshing(true);

    try {
      // Try to navigate back first - if rate limit is still active,
      // the server will redirect back to this page
      window.history.back();

      // If we're still here after a short delay, force a refresh
      setTimeout(() => {
        if (!document.hidden) {
          window.location.reload();
        }
      }, 500);
    } catch {
      // Fallback to refresh if navigation fails
      window.location.reload();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Rate Limit Exceeded</CardTitle>
        <CardDescription>
          Please wait before making another request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-100 p-4">
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold tabular-nums">
              {Math.max(0, secondsRemaining)}
            </h3>
            <p className="text-sm text-gray-500">
              {isCountdownComplete
                ? "You can now proceed"
                : "seconds remaining"}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBack}
          disabled={!isCountdownComplete || isRefreshing}
          className="w-full"
          variant={isCountdownComplete ? "default" : "outline"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isRefreshing
            ? "Checking..."
            : isCountdownComplete
              ? "Continue"
              : "Please wait..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
