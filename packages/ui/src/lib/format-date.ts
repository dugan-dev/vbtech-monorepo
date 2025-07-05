type props = {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
};

export function formatDate({ date, options }: props) {
  // Early return with default formatting if no options provided
  if (!options) {
    const dateObject =
      date instanceof Date
        ? date
        : new Date(date.includes("T") ? date : `${date}T00:00:00`);
    return dateObject.toLocaleDateString("en-US");
  }

  // Create a date object, adding time if not present
  const dateObject =
    date instanceof Date
      ? date
      : new Date(date.includes("T") ? date : `${date}T00:00:00`);

  return dateObject.toLocaleString("en-US", options);
}
