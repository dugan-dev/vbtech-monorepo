type props = {
  date: Date | string;
};

/**
 * Formats a date for database storage in YYYY-MM-DD format
 * @throws {TypeError} When the provided date is invalid
 */
export function formatDateForDb({ date }: props): string {
  const dateObject = date instanceof Date ? date : new Date(date);

  // Validate that the date is valid (invalid dates have NaN time)
  if (Number.isNaN(dateObject.getTime())) {
    throw new TypeError(
      `Invalid date provided to formatDateForDb: ${typeof date === "string" ? `"${date}"` : date}`,
    );
  }

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
