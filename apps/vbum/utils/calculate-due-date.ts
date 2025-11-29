import { format, isValid, parse } from "date-fns";

/**
 * Calculates the due date based on received date, case type, and TAT days
 * @param receivedDate - The date the case was received (can be string or Date)
 * @param caseType - "Standard" or "Expedited"
 * @param tatStandard - Number of days for standard cases
 * @param tatExpedited - Number of days for expedited cases
 * @returns The calculated due date as a Date object, or null if receivedDate is not provided
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
 * Formats a due date for display
 * @param dueDate - The due date to format
 * @returns Formatted date string in "PPP" format (e.g., "April 29, 2023")
 */
export function formatDueDate(dueDate: Date | null): string {
  if (!dueDate) {
    return "";
  }
  return format(dueDate, "PPP");
}
