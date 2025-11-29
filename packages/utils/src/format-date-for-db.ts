type props = {
  date: Date | string;
};

/**
 * Formats a date for database storage in YYYY-MM-DD format.
 *
 * @param date - A Date instance or a string parseable by the JavaScript Date constructor.
 * @returns The date represented as `YYYY-MM-DD`.
 */
export function formatDateForDb({ date }: props): string {
  const dateObject = date instanceof Date ? date : new Date(date);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}