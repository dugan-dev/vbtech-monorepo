type props = {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
};

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
