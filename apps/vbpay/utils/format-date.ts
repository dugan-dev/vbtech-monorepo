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

  // Ensure the dateTime attribute matches exactly what server will render
  const dateTimeStr =
    dateObject instanceof Date
      ? dateObject.toLocaleDateString("en-US")
      : dateObject;

  return new Date(dateTimeStr).toLocaleDateString("en-US", options);
}
