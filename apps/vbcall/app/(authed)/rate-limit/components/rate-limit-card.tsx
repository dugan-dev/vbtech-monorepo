"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

import { Icons } from "@/components/icons";

type props = {
  retryIn: number;
};

/**
 * Renders a card indicating the user has exceeded the rate limit and shows a countdown timer.
 *
 * This component displays a countdown that starts at the provided retry duration (retryIn) and decreases
 * every second. If a valid "retryAfter" query parameter is present, it uses this value to compute the progress.
 * Until the countdown completes, the action button remains disabled.
 *
 * @param retryIn - The initial number of seconds the user must wait before proceeding.
 * @returns A JSX element representing the rate limit notification card.
 */
export function RateLimitCard({ retryIn }: props) {
  const searchParams = useSearchParams();
  const retryAfterUrl = searchParams.get("retryAfter");
  const retryAfter = retryAfterUrl
    ? isNaN(parseInt(retryAfterUrl))
      ? undefined
      : parseInt(retryAfterUrl)
    : undefined;
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(retryIn);
  const [isCountdownComplete, setIsCountdownComplete] = useState(retryIn <= 0);

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
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const progress = retryAfter
    ? Math.max(0, (secondsRemaining / retryAfter) * 100)
    : retryIn > 0
      ? Math.max(0, (secondsRemaining / retryIn) * 100)
      : 0;

  const handleBack = () => {
    router.back();
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
            <Icons.clock className="h-8 w-8 text-gray-500" />
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold tabular-nums">
              {secondsRemaining}
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
          disabled={!isCountdownComplete}
          className="w-full"
          variant={isCountdownComplete ? "default" : "outline"}
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          {isCountdownComplete ? "Continue" : "Please wait..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
