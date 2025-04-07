type props = {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
};

/**
 * Formats a date into a US locale date string.
 *
 * Accepts a date input as either a Date object or a string. When a string without a time component is provided, it is normalized to represent the start of the day before formatting. The function then returns the date formatted using the "en-US" locale and any provided formatting options.
 *
 * @param date - A Date object or a date string. For string inputs that lack a time component, a default time of "T00:00:00" is appended.
 * @param options - Optional formatting options from {@link Intl.DateTimeFormatOptions} applied during formatting.
 * @returns The formatted date string in "en-US" format.
 *
 * @example
 * formatDate({ date: '2025-04-26' });
 *
 * @example
 * formatDate({ date: new Date(), options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } });
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

  return new Date(dateObject).toLocaleDateString("en-US", options);
}
