import { Loader2Icon } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a spinning loader icon for indicating a loading state.
 *
 * @param className - Additional CSS classes to merge with the default "size-4 animate-spin"
 * @param props - Additional SVG properties forwarded to the underlying icon
 * @returns A Loader2Icon SVG element with `role="status"`, `aria-label="Loading"`, and combined classes
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
