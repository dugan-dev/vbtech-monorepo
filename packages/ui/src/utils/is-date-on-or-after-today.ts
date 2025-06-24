/**
 * Checks if a given date is on or after today.
 *
 * This function compares the input date with today's date, ignoring time
 * components. It's useful for validating dates in forms or determining
 * if a date is in the past, present, or future.
 *
 * @param date - The date to check, can be a Date object or date string
 * @returns True if the date is today or in the future, false if it's in the past
 *
 * @example
 * ```typescript
 * // Check if a date is today or later
 * isDateOnOrAfterToday(new Date()); // true
 * isDateOnOrAfterToday('2023-12-25'); // depends on current date
 * isDateOnOrAfterToday('2020-01-01'); // false (past date)
 * ```
 */
export function isDateOnOrAfterToday(date: Date | string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= today;
}
