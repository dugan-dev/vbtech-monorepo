"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provides React Query client to all nested components.
 *
 * Configured with sensible defaults for server action caching:
 * - 1 minute stale time (data considered fresh)
 * - 5 minute garbage collection (cached data retention)
 * - No automatic refetch on window focus
 * - Single retry on failure
 *
 * This provider wraps the application to enable client-side caching
 * for read-only server actions like procedure code validation.
 *
 * @param children - React nodes to render within the provider
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
