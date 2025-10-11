"use client";

import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";

/**
 * Renders a semantic fieldset with the component's default layout and a `data-slot="field-set"` marker.
 *
 * @param className - Additional CSS classes appended to the component's default layout classes
 * @param props - Any other props forwarded to the underlying `fieldset` element
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a legend element for a fieldset with a variant-controlled text size and slot metadata.
 *
 * @param className - Additional CSS classes to apply to the legend
 * @param variant - Visual variant: `"legend"` applies base text size, `"label"` applies smaller text
 * @returns A `<legend>` element with `data-slot="field-legend"`, `data-variant` set to the selected variant, and merged class names
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Container for grouping related form fields and controls.
 *
 * Renders a div with `data-slot="field-group"` and utility classes that establish layout, spacing, and container grouping. Additional class names and other div props are merged and forwarded to the element.
 *
 * @returns The rendered `div` element serving as a field group.
 */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

/**
 * Renders a grouped field container that applies orientation-aware layout classes and accessibility attributes.
 *
 * @param orientation - Controls layout orientation: `"vertical"`, `"horizontal"`, or `"responsive"`. This changes the component's layout and alignment classes.
 * @returns A div element that serves as the field group container with role="group", data-slot="field", and data-orientation set to the chosen orientation. Additional props are spread onto the rendered div.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * Renders the content region of a Field as a flexible column container for inputs, descriptions, and helper elements.
 *
 * @returns A `div` element serving as the field content container with layout classes applied.
 */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a styled Label intended for use as a form field label with slot metadata for composition.
 *
 * The component forwards all Label props and applies data-slot="field-label" plus a set of utility
 * classes that control layout, responsive behavior, and state-based styling.
 *
 * @returns A Label element configured as a field label with `data-slot="field-label"` and composed utility classes.
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the title area for a field with layout and typography styles.
 *
 * Renders a div intended as the field's label/title slot and applies spacing,
 * sizing, and disabled-state styling.
 *
 * @returns A div element used as the field title area (data-slot="field-label").
 */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a paragraph used for field description text with built-in typography and link styles.
 *
 * @returns A `<p>` element with `data-slot="field-description"` and utility classes for muted text, spacing, responsive adjustments, and link appearance.
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders a horizontal separator with optional centered content between the lines.
 *
 * @param children - Optional content to display centered on the separator (for example, a label).
 * @param className - Additional CSS class names applied to the separator container.
 * @returns A div element containing the separator line and optional centered content.
 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * Render field-level error content as an accessible alert when `children` or `errors` are provided.
 *
 * If `children` is present it is used as the content. Otherwise, if `errors` contains a single entry
 * with a `message` that message is rendered directly; multiple messages are rendered as a bulleted list.
 *
 * @param children - Explicit content to render inside the error block; takes precedence over `errors`.
 * @param errors - Optional array of error objects; each item may include a `message` string.
 * @returns A `div` with `role="alert"` containing the computed error content, or `null` when there is no content.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors) {
      return null;
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
