"use client";

import { useMemo } from "react";
import { useWorklistContext } from "@/contexts/worklist-context";
import { parseAsString, useQueryState } from "nuqs";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { formatDate } from "@workspace/utils/format-date";

import { WorklistTable } from "./worklist-table";

/**
 * Produces a human-readable due date label for a case based on its received date and turnaround times.
 *
 * @param receivedDate - The case received date; when `null` an empty string is returned
 * @param caseType - Case type; `"Expedited"` selects the expedited turnaround, otherwise the standard turnaround is used
 * @param tatStandard - Standard turnaround time in days
 * @param tatExpedited - Expedited turnaround time in days
 * @returns The formatted due date followed by one of: `Overdue`, `Today`, `Tomorrow`, or `X days remaining`; returns an empty string if `receivedDate` is `null`
 */
function calculateDueDateDisplay(
  receivedDate: Date | null,
  caseType: string,
  tatStandard: number,
  tatExpedited: number,
): string {
  if (!receivedDate) {
    return "";
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

  const formattedDate = formatDate({ date: dueDate });

  if (diffDays < 0) {
    return `${formattedDate} Overdue`;
  } else if (diffDays === 0) {
    return `${formattedDate} Today`;
  } else if (diffDays === 1) {
    return `${formattedDate} Tomorrow`;
  } else {
    return `${formattedDate} ${diffDays} days remaining`;
  }
}

/**
 * Render the worklist UI with tabbed views for open and closed cases.
 *
 * Uses worklist context and URL query state to compute filtered lists of cases
 * (search, status, client, and nurse/assigned filters). Each tab displays a
 * WorklistTable populated with the corresponding filtered cases and shows
 * counts in the tab headers.
 *
 * @returns A React element containing the tabs and tables for filtered open and closed cases.
 */
export function WorklistContent() {
  const { openCases, closedCases, physicians, healthPlans } =
    useWorklistContext();
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("open"));
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [clientFilter] = useQueryState(
    "client",
    parseAsString.withDefault("all"),
  );
  const [nurseFilter] = useQueryState(
    "nurse",
    parseAsString.withDefault("all"),
  );

  const filteredOpenCases = useMemo(() => {
    return openCases.filter((case_) => {
      // Get health plan for TAT calculations
      const healthPlan = healthPlans.find((hp) => hp.pubId === case_.planPubId);
      const dueDateDisplay = calculateDueDateDisplay(
        case_.recdDate,
        case_.caseType,
        healthPlan?.tatStandard ?? 14,
        healthPlan?.tatExpedited ?? 7,
      );

      // Get physician name
      const physician = physicians.find(
        (phys) => phys.pubId === case_.physPubId,
      );
      const physicianName = physician?.name ?? "";

      // Search across all visible columns
      const searchLower = search.toLowerCase();
      const matchesSearch =
        case_.caseNumber.toLowerCase().includes(searchLower) ||
        case_.clientName.toLowerCase().includes(searchLower) ||
        case_.planName.toLowerCase().includes(searchLower) ||
        case_.status.toLowerCase().includes(searchLower) ||
        (case_.fuAction?.toLowerCase().includes(searchLower) ?? false) ||
        physicianName.toLowerCase().includes(searchLower) ||
        dueDateDisplay.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || case_.status === statusFilter;
      const matchesClient =
        clientFilter === "all" || case_.clientPubId === clientFilter;
      const matchesNurse =
        nurseFilter === "all" || case_.assignedTo === nurseFilter;
      return matchesSearch && matchesStatus && matchesClient && matchesNurse;
    });
  }, [
    openCases,
    search,
    statusFilter,
    clientFilter,
    nurseFilter,
    physicians,
    healthPlans,
  ]);

  const filteredClosedCases = useMemo(() => {
    return closedCases.filter((case_) => {
      // Get health plan for TAT calculations
      const healthPlan = healthPlans.find((hp) => hp.pubId === case_.planPubId);
      const dueDateDisplay = calculateDueDateDisplay(
        case_.recdDate,
        case_.caseType,
        healthPlan?.tatStandard ?? 14,
        healthPlan?.tatExpedited ?? 7,
      );

      // Get physician name
      const physician = physicians.find(
        (phys) => phys.pubId === case_.physPubId,
      );
      const physicianName = physician?.name ?? "";

      // Search across all visible columns
      const searchLower = search.toLowerCase();
      const matchesSearch =
        case_.caseNumber.toLowerCase().includes(searchLower) ||
        case_.clientName.toLowerCase().includes(searchLower) ||
        case_.planName.toLowerCase().includes(searchLower) ||
        case_.status.toLowerCase().includes(searchLower) ||
        (case_.fuAction?.toLowerCase().includes(searchLower) ?? false) ||
        physicianName.toLowerCase().includes(searchLower) ||
        dueDateDisplay.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || case_.status === statusFilter;
      const matchesClient =
        clientFilter === "all" || case_.clientPubId === clientFilter;
      const matchesNurse =
        nurseFilter === "all" || case_.assignedTo === nurseFilter;
      return matchesSearch && matchesStatus && matchesClient && matchesNurse;
    });
  }, [
    closedCases,
    search,
    statusFilter,
    clientFilter,
    nurseFilter,
    physicians,
    healthPlans,
  ]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="open">
          Open Cases ({filteredOpenCases.length})
        </TabsTrigger>
        <TabsTrigger value="closed">
          Closed Cases ({filteredClosedCases.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="open" className="mt-0">
        <WorklistTable cases={filteredOpenCases} type="open" />
      </TabsContent>

      <TabsContent value="closed" className="mt-0">
        <WorklistTable cases={filteredClosedCases} type="closed" />
      </TabsContent>
    </Tabs>
  );
}
