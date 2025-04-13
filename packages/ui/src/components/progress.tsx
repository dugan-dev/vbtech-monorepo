"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a progress bar using Radix UI progress primitives.
 *
 * The filled portion of the bar is adjusted based on the `value` prop: a value of 0 results in an empty bar, while 100 fills it completely. The component applies a CSS transform on the indicator to achieve this effect, and forwards additional props to the underlying container.
 *
 * @param value - Numeric progress value (0 to 100) that sets the fill level of the progress bar.
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
