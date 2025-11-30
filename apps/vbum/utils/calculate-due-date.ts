import { format, isValid, parse } from "date-fns";

import { formatDate } from "@workspace/utils/format-date";

/**
 * Parse a date input into a valid Date object.
 *
 * @param dateInput - The date as a `Date`, ISO-like string (`yyyy-MM-dd`), `M/d/yyyy` string, or other date string; may be `null`
 * @returns A valid `Date` object, or `null` if the input is missing or cannot be parsed
 */
function parseDate(dateInput: string | Date | null): Date | null {
  if (!dateInput) {
    return null;
  }

  // Handle different date formats
  let parsed: Date;
  if (dateInput instanceof Date) {
    parsed = dateInput;
  } else if (typeof dateInput === "string") {
    // Try parsing as yyyy-MM-dd format first (from new-case-sheet)
    if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      parsed = parse(dateInput, "yyyy-MM-dd", new Date());
    }
    // Try parsing as M/d/yyyy format (from case-review-sheet after formatDate)
    else if (dateInput.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      parsed = parse(dateInput, "M/d/yyyy", new Date());
    }
    // Fallback to native Date parsing
    else {
      parsed = new Date(dateInput);
    }
  } else {
    return null;
  }

  // Validate the date
  if (!isValid(parsed)) {
    return null;
  }

  return parsed;
}

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
  const received = parseDate(receivedDate);
  if (!received) {
    return null;
  }

  const daysToAdd = caseType === "Expedited" ? tatExpedited : tatStandard;
  const dueDate = new Date(received);
  dueDate.setDate(dueDate.getDate() + daysToAdd);

  return dueDate;
}

/**
 * Compute a case due date, a human-readable due display, and a relative status compared to today.
 *
 * @param receivedDate - The date the case was received; when `null`, the result indicates no due date.
 * @param caseType - Case type string; `"Expedited"` selects `tatExpedited`, otherwise `tatStandard` is used.
 * @param tatStandard - Turnaround time in days for standard cases.
 * @param tatExpedited - Turnaround time in days for expedited cases.
 * @returns An object containing:
 *  - `dueDate`: the calculated due `Date` or `null` if `receivedDate` was `null`;
 *  - `display`: a short human-readable string such as `"Overdue"`, `"Today"`, `"Tomorrow"`, or `"{N} days remaining"`;
 *  - `status`: one of `"overdue"`, `"today"`, `"tomorrow"`, or `"upcoming"` indicating the due date relative to today.
 */
export function calculateDueDateWithStatus(
  receivedDate: string | Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): {
  dueDate: Date | null;
  display: string;
  status: "overdue" | "today" | "upcoming" | "tomorrow";
} {
  const dueDate = calculateDueDate(
    receivedDate,
    caseType,
    tatStandard,
    tatExpedited,
  );

  if (!dueDate) {
    return { dueDate: null, display: "—", status: "upcoming" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { dueDate, display: "Overdue", status: "overdue" };
  } else if (diffDays === 0) {
    return { dueDate, display: "Today", status: "today" };
  } else if (diffDays === 1) {
    return { dueDate, display: "Tomorrow", status: "tomorrow" };
  } else {
    return {
      dueDate,
      display: `${diffDays} days remaining`,
      status: "upcoming",
    };
  }
}

/**
 * Compute a case due date display that includes both the formatted date and relative status.
 *
 * @param receivedDate - The date the case was received; when `null`, returns an empty string.
 * @param caseType - Case type string; `"Expedited"` selects `tatExpedited`, otherwise `tatStandard` is used.
 * @param tatStandard - Turnaround time in days for standard cases.
 * @param tatExpedited - Turnaround time in days for expedited cases.
 * @returns A formatted string like `"4/15/2025 Overdue"` or `"4/20/2025 3 days remaining"`, or an empty string if `receivedDate` is `null`.
 */
export function calculateDueDateDisplay(
  receivedDate: string | Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): string {
  const { dueDate, display } = calculateDueDateWithStatus(
    receivedDate,
    caseType,
    tatStandard,
    tatExpedited,
  );

  if (!dueDate) {
    return "";
  }

  const formattedDate = formatDate({ date: dueDate });
  return `${formattedDate} ${display}`;
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
