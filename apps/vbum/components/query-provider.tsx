"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Wraps children in a QueryClientProvider configured for short-lived client-side caching.
 *
 * The provider configures sensible defaults for read-only server action caching:
 * 1 minute stale time, 5 minute garbage collection, no refetch on window focus, and one retry.
 *
 * @param children - React nodes to render within the provider
 * @returns The React element that provides a configured QueryClient to `children`
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute - data is fresh for this long
            gcTime: 5 * 60 * 1000, // 5 minutes - how long to keep unused data in cache
            refetchOnWindowFocus: false, // Don't refetch when user returns to tab
            retry: 1, // Only retry failed requests once
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
