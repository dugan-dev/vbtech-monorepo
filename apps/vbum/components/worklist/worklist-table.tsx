"use client";

import { useWorklistContext } from "@/contexts/worklist-context";
import { AlertCircle } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { formatDate } from "@workspace/utils/format-date";

import { umCase } from "@/types/um-case";

import { CaseSheet } from "./case-sheet";
import { PaginationControls } from "./pagination-controls";

type props = {
  cases: umCase[];
  type: "open" | "closed";
};

/**
 * Map a case status label to the Tailwind CSS class string used to style its badge.
 *
 * @param status - Case status (e.g., "Approved", "Under Review", "Moved to MD", "Withdrawn", "Offer P2P", "P2P Scheduled", "Not reviewed")
 * @returns A CSS class string appropriate for styling a status badge (background, text, hover and dark-mode variants)
 */
function getStatusColor(status: string): string {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Under Review":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
    case "Moved to MD":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    case "Withdrawn":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    case "Offer P2P":
    case "P2P Scheduled":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400";
    case "Not reviewed":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
  }
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
function calculateDueDate(
  receivedDate: Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): {
  dueDate: Date | null;
  display: string;
  status: "overdue" | "today" | "upcoming" | "tomorrow";
} {
  if (!receivedDate) {
    return { dueDate: null, display: "—", status: "upcoming" };
  }

  const received = new Date(formatDate({ date: receivedDate }));
  const daysToAdd = caseType === "Expedited" ? tatExpedited : tatStandard;
  const dueDate = new Date(received);
  dueDate.setDate(dueDate.getDate() + daysToAdd);

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
 * Selects the CSS class string used to style a due-date display based on its status.
 *
 * @param status - Due-date status: `"overdue"`, `"today"`, `"tomorrow"`, or `"upcoming"`
 * @returns The CSS class string to apply to the due-date element
 */
function getDueDateColor(
  status: "overdue" | "today" | "upcoming" | "tomorrow",
): string {
  switch (status) {
    case "overdue":
      return "text-red-600 dark:text-red-400 font-semibold";
    case "tomorrow":
      return "text-amber-600 dark:text-amber-600 font-semibold";
    case "today":
      return "text-red-500 dark:text-red-500 font-semibold";
    case "upcoming":
      return "text-muted-foreground";
  }
}

/**
 * Compute timeliness metrics for a closed case relative to its turnaround time (TAT).
 *
 * If either `receivedDate` or `closedDate` is missing, returns default metrics with the required TAT determined by `caseType`.
 *
 * @param receivedDate - Date the case was received (or `null` if unknown)
 * @param closedDate - Date the case was closed (or `null` if unknown)
 * @param caseType - Case priority type; expected values include `"Expedited"` to select expedited TAT
 * @param tatStandard - Standard TAT in days
 * @param tatExpedited - Expedited TAT in days
 * @returns An object with:
 *  - `actualTAT`: number of days between received and closed (rounded up)
 *  - `requiredTAT`: the TAT used for comparison (based on `caseType`)
 *  - `daysLate`: `actualTAT - requiredTAT` (negative if closed early)
 *  - `isTimely`: `true` if `daysLate <= 0`, `false` otherwise
 *  - `status`: `"timely"` when closed before the due date, `"just-in-time"` when closed exactly on the due date, or `"late"` when closed after the due date
 *  - `color`: CSS class string suitable for styling the status display
 */
function calculateClosedCaseMetrics(
  receivedDate: Date | null,
  closedDate: Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): {
  actualTAT: number;
  requiredTAT: number;
  daysLate: number;
  isTimely: boolean;
  status: "timely" | "late" | "just-in-time";
  color: string;
} {
  if (!receivedDate || !closedDate) {
    return {
      actualTAT: 0,
      requiredTAT: caseType === "Expedited" ? tatExpedited : tatStandard,
      daysLate: 0,
      isTimely: false,
      status: "timely",
      color: "text-muted-foreground",
    };
  }

  const received = new Date(formatDate({ date: receivedDate }));
  received.setHours(0, 0, 0, 0);
  const closed = new Date(formatDate({ date: closedDate }));
  closed.setHours(0, 0, 0, 0);

  const diffTime = closed.getTime() - received.getTime();
  const actualTAT = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const requiredTAT = caseType === "Expedited" ? tatExpedited : tatStandard;
  const daysLate = actualTAT - requiredTAT;

  let status: "timely" | "late" | "just-in-time";
  let color: string;

  if (daysLate < 0) {
    // Closed early
    status = "timely";
    color = "text-emerald-600 dark:text-emerald-400 font-semibold";
  } else if (daysLate === 0) {
    // Closed exactly on due date
    status = "just-in-time";
    color = "text-amber-600 dark:text-amber-400 font-semibold";
  } else {
    // Closed late
    status = "late";
    color = "text-red-600 dark:text-red-400 font-semibold";
  }

  return {
    actualTAT,
    requiredTAT,
    daysLate,
    isTimely: daysLate <= 0,
    status,
    color,
  };
}

/**
 * Render a paginated worklist table for either open or closed cases.
 *
 * Renders case rows with due/closed date metrics, status badges, follow-up action,
 * MD escalation indicators, and an actions button that sets the selected case for review.
 * Pagination state (page and pageSize) and the selected case ID are persisted to the URL query string.
 *
 * @param cases - Array of cases to display in the table
 * @param type - Determines table mode: `"open"` shows due dates and review actions; `"closed"` shows closed-date metrics and view actions
 * @returns The worklist table element including row rendering, pagination controls (when cases exist), and the CaseSheet review viewer
 */
export function WorklistTable({ cases, type }: props) {
  const [, setCaseId] = useQueryState(
    "caseId",
    parseAsString.withOptions({ shallow: false }),
  );

  const [page, setPage] = useQueryState(
    type === "open" ? "openPage" : "closedPage",
    parseAsInteger.withDefault(1),
  );

  const [pageSize, setPageSize] = useQueryState(
    type === "open" ? "openPageSize" : "closedPageSize",
    parseAsInteger.withDefault(10),
  );

  const { physicians, healthPlans } = useWorklistContext();

  const handleReviewCase = (caseData: umCase) => {
    setCaseId(caseData.pubId);
  };

  const totalPages = Math.ceil(cases.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCases = cases.slice(startIndex, endIndex);

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number.parseInt(newSize, 10));
    setPage(1);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Health Plan</TableHead>
              <TableHead>
                {type === "closed" ? "Closed Date" : "Due Date"}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Follow Up Action</TableHead>
              <TableHead>MD Escalation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {type === "open"
                    ? "No cases found."
                    : "No closed cases found."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCases.map((case_) => {
                const healthPlan = healthPlans.find(
                  (hp) => hp.pubId === case_.planPubId,
                );

                // Calculate metrics based on case type (open vs closed)
                const openCaseMetrics =
                  type === "open"
                    ? calculateDueDate(
                        case_.recdDate,
                        case_.caseType,
                        healthPlan?.tatStandard ?? 14,
                        healthPlan?.tatExpedited ?? 7,
                      )
                    : null;

                const closedCaseMetrics =
                  type === "closed"
                    ? calculateClosedCaseMetrics(
                        case_.recdDate,
                        case_.closedAt,
                        case_.caseType,
                        healthPlan?.tatStandard ?? 14,
                        healthPlan?.tatExpedited ?? 7,
                      )
                    : null;

                return (
                  <TableRow
                    key={case_.pubId}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      {case_.caseNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {case_.clientName}
                    </TableCell>
                    <TableCell>{case_.planName}</TableCell>
                    <TableCell
                      className={
                        type === "open"
                          ? getDueDateColor(
                              openCaseMetrics?.status ?? "upcoming",
                            )
                          : closedCaseMetrics?.color
                      }
                    >
                      {type === "open"
                        ? openCaseMetrics?.dueDate && (
                            <HoverCard>
                              <HoverCardTrigger>
                                {formatDate({ date: openCaseMetrics.dueDate })}
                              </HoverCardTrigger>
                              <HoverCardContent className="w-auto max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {openCaseMetrics.display}
                                  </p>
                                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                                    {case_.caseType} review •{" "}
                                    {case_.caseType === "Expedited"
                                      ? healthPlan?.tatExpedited
                                      : healthPlan?.tatStandard}
                                    -day TAT required
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )
                        : case_.closedAt &&
                          closedCaseMetrics && (
                            <HoverCard>
                              <HoverCardTrigger>
                                {formatDate({ date: case_.closedAt })}
                              </HoverCardTrigger>
                              <HoverCardContent className="w-auto max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {closedCaseMetrics.status === "timely"
                                      ? "✓ Timely"
                                      : closedCaseMetrics.status ===
                                          "just-in-time"
                                        ? "Just in time"
                                        : `✗ Late by ${closedCaseMetrics.daysLate} day${closedCaseMetrics.daysLate !== 1 ? "s" : ""}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                                    Closed in {closedCaseMetrics.actualTAT} day
                                    {closedCaseMetrics.actualTAT !== 1
                                      ? "s"
                                      : ""}
                                  </p>
                                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                                    Required: {closedCaseMetrics.requiredTAT}{" "}
                                    day
                                    {closedCaseMetrics.requiredTAT !== 1
                                      ? "s"
                                      : ""}{" "}
                                    ({case_.caseType})
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(case_.status)}>
                        {case_.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {case_.fuAction ? (
                        <span className="text-sm">{case_.fuAction}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {case_.mdReview === 1 ? (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            {physicians.find(
                              (phys) => phys.pubId === case_.physPubId,
                            )?.name ?? ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviewCase(case_)}
                      >
                        {type === "open" ? "Review" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {cases.length > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={cases.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
      <CaseSheet mode="review" />
    </>
  );
}
