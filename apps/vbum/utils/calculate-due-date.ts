import { format, isValid, parse } from "date-fns";

/**
 * Compute the due date from the received date using case type and TAT values.
 *
 * @param receivedDate - The received date as a `Date`, ISO-like string (`yyyy-MM-dd`), `M/d/yyyy` string, or other date string; may be `null`
 * @param caseType - Case priority, where `"Expedited"` uses the expedited TAT and any other value uses the standard TAT
 * @param tatStandard - Days to add for standard cases
 * @param tatExpedited - Days to add for expedited cases
 * @returns A `Date` representing the calculated due date, or `null` if `receivedDate` is missing or cannot be parsed into a valid date
 */
export function calculateDueDate(
  receivedDate: string | Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): Date | null {
  if (!receivedDate) {
    return null;
  }

  // Handle different date formats
  let received: Date;
  if (receivedDate instanceof Date) {
    received = receivedDate;
  } else if (typeof receivedDate === "string") {
    // Try parsing as yyyy-MM-dd format first (from new-case-sheet)
    if (receivedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      received = parse(receivedDate, "yyyy-MM-dd", new Date());
    }
    // Try parsing as M/d/yyyy format (from case-review-sheet after formatDate)
    else if (receivedDate.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      received = parse(receivedDate, "M/d/yyyy", new Date());
    }
    // Fallback to native Date parsing
    else {
      received = new Date(receivedDate);
    }
  } else {
    return null;
  }

  // Validate the date
  if (!isValid(received)) {
    return null;
  }

  const daysToAdd = caseType === "Expedited" ? tatExpedited : tatStandard;
  const dueDate = new Date(received);
  dueDate.setDate(dueDate.getDate() + daysToAdd);

  return dueDate;
}

/**
 * Format a due date for display.
 *
 * @returns An empty string if `dueDate` is null; otherwise the date formatted using the "PPP" pattern (e.g., "April 29, 2023").
 */
export function formatDueDate(dueDate: Date | null): string {
  if (!dueDate) {
    return "";
  }
  return format(dueDate, "PPP");
}