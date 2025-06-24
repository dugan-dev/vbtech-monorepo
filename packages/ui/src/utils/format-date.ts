/**
 * Props for the formatDate function.
 */
type props = {
  /** Date to format, can be a Date object or date string */
  date: Date | string;
  /** Optional Intl.DateTimeFormatOptions for custom formatting */
  options?: Intl.DateTimeFormatOptions;
};

/**
 * Formats a date using the browser's locale and optional formatting options.
 *
 * This function handles both Date objects and date strings, automatically
 * creating a Date object if a string is provided. It uses the browser's
 * locale settings for consistent formatting across the application.
 *
 * @param props - Configuration object containing the date and optional formatting options
 * @returns Formatted date string according to the browser's locale
 *
 * @example
 * ```typescript
 * // Basic usage
 * formatDate({ date: new Date() });
 * // Returns: "12/25/2023"
 *
 * // With custom options
 * formatDate({
 *   date: "2023-12-25",
 *   options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
 * });
 * // Returns: "Monday, December 25, 2023"
 * ```
 */
export function formatDate({ date, options }: props) {
  // Create a date at the start of the day in local time
  const dateObject =
    date instanceof Date
      ? date
      : new Date(
          date.includes("T")
            ? date
            : new Date(`${date}T00:00:00`).toLocaleDateString("en-US"),
        );

  return dateObject.toLocaleDateString("en-US", options);
}
