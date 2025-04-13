"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a progress bar with a smoothly animated indicator.
 *
 * This component leverages Radix UI’s progress primitives to display a bar where the filled portion
 * corresponds to the provided progress value. The indicator's width dynamically adjusts based on the
 * `value` prop, with a default of 0% progress if no value is specified.
 *
 * @param className - Additional CSS classes to style the progress container.
 * @param value - The current progress percentage (0 to 100); defaults to 0 if not provided.
 * @param props - Extra properties passed to the underlying Radix UI progress component.
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
