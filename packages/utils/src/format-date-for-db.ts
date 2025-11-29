type props = {
  date: Date | string;
};

/**
 * Formats a date for database storage in YYYY-MM-DD format
 */
export function formatDateForDb({ date }: props): string {
  const dateObject = date instanceof Date ? date : new Date(date);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
