import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a styled container for empty-state content.
 *
 * @returns A div element serving as the empty-state container.
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the header container used in an empty-state layout.
 *
 * The element accepts and forwards standard div props (including `className`) and exposes
 * a `data-slot="empty-header"` attribute for slot-targeting.
 *
 * @returns The header container element for an empty state.
 */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className,
      )}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Render a div used as the empty-state media container.
 *
 * @param variant - Visual variant to apply: `"default"` for transparent background or `"icon"` for a centered, rounded, muted icon container.
 * @returns The rendered div element for the empty-state media area.
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

/**
 * Renders the empty-state title container.
 *
 * @param className - Additional CSS classes to apply to the title container
 * @param props - Other div props forwarded to the root element
 * @returns The div element with `data-slot="empty-title"` and composed classes
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
}

/**
 * Renders the description element for an empty state.
 *
 * Renders a div (accepts and forwards `p` element props) styled for muted descriptive text and anchor styling, and includes `data-slot="empty-description"` for slot targeting.
 *
 * @returns A div element used as the empty-state description.
 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the content area for an empty state with centered, stacked layout and small text.
 *
 * @returns A div element with `data-slot="empty-content"`, layout and typography classes applied, and any received props forwarded to the root element.
 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};