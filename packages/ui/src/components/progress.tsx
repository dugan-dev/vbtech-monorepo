"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a progress bar component using Radix UI's primitives.
 *
 * This component displays a horizontal progress bar where the filled portion is determined by the
 * `value` prop. A `value` of 0 results in an empty bar, while a `value` of 100 fills the bar completely.
 * Additional properties are forwarded to the underlying progress bar container, and custom styling
 * can be applied via the `className` prop.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
