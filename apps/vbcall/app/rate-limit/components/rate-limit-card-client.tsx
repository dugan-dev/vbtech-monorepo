"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { RateLimitCard } from "@workspace/ui/components/common/rate-limit-card";

export function RateLimitCardClient({ retryIn }: { retryIn: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <RateLimitCard
      retryIn={retryIn}
      router={router}
      searchParams={searchParams}
    />
  );
}
