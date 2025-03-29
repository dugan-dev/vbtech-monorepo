export function getTzAdjustedFullDaySpan(
  startDateStrYYYYMMDD: string,
  endDateStrYYYYMMDD: string,
) {
  // Create dates at start of day/end of day in local timezone
  const startDate = new Date(`${startDateStrYYYYMMDD}T00:00:00`);

  // Calculate timezone offset
  const tzOffset = startDate.getTimezoneOffset() / 60;

  // Adjust for UTC storage while preserving the intended local date
  const fromDate = new Date(
    `${startDateStrYYYYMMDD}T${String(tzOffset).padStart(2, "0")}:00:00.000Z`,
  );
  const toDate = new Date(
    `${endDateStrYYYYMMDD}T${String(tzOffset - 1).padStart(2, "0")}:59:59.999Z`,
  );

  return { fromDate, toDate };
}
