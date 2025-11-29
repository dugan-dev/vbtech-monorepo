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
