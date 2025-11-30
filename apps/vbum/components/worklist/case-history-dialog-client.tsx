"use client";

import { useState } from "react";
import { useWorklistContext } from "@/contexts/worklist-context";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, History } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

import { umCase } from "@/types/um-case";
import { UmCaseHistory } from "@/types/um-case-history";

type props = {
  history: UmCaseHistory[];
  currentCase: umCase;
};

/**
 * Render a modal dialog showing the version history and field-level differences for a case.
 *
 * The dialog presents the current case and prior versions, highlights changed fields between
 * consecutive versions, and provides controls to navigate newer/older versions. Opening the
 * dialog resets the view to the latest version; closing the dialog returns the view to the latest.
 *
 * @param history - Array of historical case versions (previous snapshots) to compare against the current case
 * @param currentCase - The active case object to display as the current version
 * @returns A React element that renders a case history dialog with formatted values, diffs, and navigation controls
 */
export function CaseHistoryDialogClient({ history, currentCase }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { nurses, physicians, users, healthPlans, clients } =
    useWorklistContext();

  // Sort history by date descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );

  // Create a comparison of each version with the previous one
  const versions = [currentCase, ...sortedHistory];

  const currentVersion = versions[currentIndex]!;
  const previousVersion = versions[currentIndex + 1];
  const isCurrentVersion = currentIndex === 0;

  const formatDateValue = (val: unknown): string => {
    if (val instanceof Date) {
      return format(val, "MMM d, yyyy 'at' h:mm a");
    }
    return val ? String(val) : "—";
  };

  const formatUserValue = (userId: unknown): string => {
    if (!userId) return "—";
    const userName = users
      .map((user) => ({
        ...user,
        userName: `${user.firstName} ${user.lastName}`,
      }))
      .find((user) => user.userId === userId)?.userName;
    return userName || String(userId);
  };

  const formatHealthPlanValue = (planPubId: unknown): string => {
    if (!planPubId) return "—";
    const planName = healthPlans.find(
      (plan) => plan.pubId === planPubId,
    )?.planName;
    return planName || String(planPubId);
  };

  const formatClientValue = (clientPubId: unknown): string => {
    if (!clientPubId) return "—";
    const client = clients.find((client) => client.value === clientPubId);
    if (client?.selectionDisplay) return client.selectionDisplay;
    if (client?.label) return String(client.label);
    return String(clientPubId);
  };

  const getFieldValue = (version: umCase | UmCaseHistory, key: string) => {
    return (version as Record<string, unknown>)[key];
  };

  const getChangedFields = (
    current: umCase | UmCaseHistory,
    previous: umCase | UmCaseHistory,
  ) => {
    const changes: Array<{
      field: string;
      oldValue: string;
      newValue: string;
    }> = [];

    const compareFields = [
      { key: "caseNumber", label: "Case Number" },
      { key: "caseType", label: "Case Type" },
      { key: "clientPubId", label: "Client" },
      { key: "planPubId", label: "Health Plan" },
      { key: "recdDate", label: "Received Date" },
      { key: "closedAt", label: "Closed Date" },
      { key: "assignedTo", label: "Assigned Nurse" },
      { key: "assignedAt", label: "Assigned At" },
      { key: "status", label: "Status" },
      { key: "fuAction", label: "Follow Up Action" },
      { key: "p2pSuccess", label: "P2P Successful" },
      { key: "mdReview", label: "Escalated to MD" },
      { key: "mdRecommended", label: "MD Recommended" },
      { key: "physPubId", label: "MD Name" },
      { key: "procedureCodes", label: "Procedure Codes" },
      { key: "remarks", label: "Remarks" },
      { key: "createdAt", label: "Created At" },
      { key: "createdBy", label: "Created By" },
      { key: "updatedAt", label: "Updated At" },
      { key: "updatedBy", label: "Updated By" },
    ];

    for (const { key, label } of compareFields) {
      const currentVal = getFieldValue(current, key);
      const previousVal = getFieldValue(previous, key);

      if (key === "mdReview" || key === "p2pSuccess") {
        if (currentVal !== previousVal) {
          changes.push({
            field: label,
            oldValue: previousVal === 1 ? "Yes" : "No",
            newValue: currentVal === 1 ? "Yes" : "No",
          });
        }
      } else if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "assignedAt" ||
        key === "recdDate" ||
        key === "closedAt"
      ) {
        // Format date fields
        const currentDate = formatDateValue(currentVal);
        const previousDate = formatDateValue(previousVal);

        if (currentDate !== previousDate) {
          changes.push({
            field: label,
            oldValue: previousDate,
            newValue: currentDate,
          });
        }
      } else if (key === "createdBy" || key === "updatedBy") {
        // Format user ID fields to show names
        const currentUserName = formatUserValue(currentVal);
        const previousUserName = formatUserValue(previousVal);

        if (currentUserName !== previousUserName) {
          changes.push({
            field: label,
            oldValue: previousUserName,
            newValue: currentUserName,
          });
        }
      } else if (key === "planPubId") {
        // Format health plan ID to show plan name
        const currentPlanName = formatHealthPlanValue(currentVal);
        const previousPlanName = formatHealthPlanValue(previousVal);

        if (currentPlanName !== previousPlanName) {
          changes.push({
            field: label,
            oldValue: previousPlanName,
            newValue: currentPlanName,
          });
        }
      } else if (key === "clientPubId") {
        // Format client ID to show client name
        const currentClientName = formatClientValue(currentVal);
        const previousClientName = formatClientValue(previousVal);

        if (currentClientName !== previousClientName) {
          changes.push({
            field: label,
            oldValue: previousClientName,
            newValue: currentClientName,
          });
        }
      } else if (key === "physPubId") {
        const currentPhysName =
          (physicians.find((phys) => phys.pubId === currentVal)?.name ??
          currentVal)
            ? String(currentVal)
            : "-";
        const previousPhysName =
          (physicians.find((phys) => phys.pubId === previousVal)?.name ??
          previousVal)
            ? String(previousVal)
            : "-";

        if (currentPhysName !== previousPhysName) {
          changes.push({
            field: label,
            oldValue: previousPhysName,
            newValue: currentPhysName,
          });
        }
      } else if (currentVal !== previousVal) {
        changes.push({
          field: label,
          oldValue: String(previousVal || "—"),
          newValue: String(currentVal || "—"),
        });
      }
    }

    return changes;
  };

  const changes = previousVersion
    ? getChangedFields(currentVersion, previousVersion)
    : [];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentIndex(0);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[85dvw] max-h-[85dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Case History - {currentCase.caseNumber}</span>
            <Badge variant="secondary" className="text-sm font-normal">
              Change {versions.length - currentIndex} of {versions.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCurrentVersion ? (
                <Badge variant="default">Current Version</Badge>
              ) : (
                <Badge variant="outline">
                  {format(
                    currentVersion.updatedAt ??
                      currentVersion.createdAt ??
                      new Date(),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {isCurrentVersion ? "Last updated" : "Changed"} by{" "}
                {formatUserValue(currentVersion.updatedBy)}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-6",
              isCurrentVersion || currentIndex === versions.length - 1
                ? undefined
                : "md:grid-cols-2",
            )}
          >
            {changes.length > 0 && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <h4 className="mb-3 text-sm font-semibold">
                  Changes from previous version:
                </h4>
                <div className="space-y-2">
                  {changes.map((change, changeIndex) => (
                    <div
                      key={changeIndex}
                      className="grid grid-cols-[120px_1fr_1fr] gap-4 text-sm"
                    >
                      <div className="font-medium text-foreground">
                        {change.field}
                      </div>
                      <div className="rounded bg-destructive/10 px-2 py-1 text-destructive line-through">
                        {change.oldValue}
                      </div>
                      <div className="rounded bg-green-500/10 px-2 py-1 text-green-700 dark:text-green-400">
                        {change.newValue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isCurrentVersion && (
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 text-sm font-semibold">
                  Complete Record at This Time:
                </h4>
                <div className="grid gap-3 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-muted-foreground">
                        Case Number:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.caseNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Case Type:</span>{" "}
                      <span className="font-medium">
                        {currentVersion.caseType || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Client:</span>{" "}
                      <span className="font-medium">
                        {formatClientValue(currentVersion.clientPubId)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Health Plan:
                      </span>{" "}
                      <span className="font-medium">
                        {formatHealthPlanValue(currentVersion.planPubId)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Received Date:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.recdDate
                          ? format(currentVersion.recdDate, "MMM d, yyyy")
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <span className="font-medium">
                        {currentVersion.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Closed Date:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.closedAt
                          ? format(currentVersion.closedAt, "MMM d, yyyy")
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Assigned Nurse:
                      </span>{" "}
                      <span className="font-medium">
                        {nurses
                          .map((nurse) => ({
                            ...nurse,
                            nurseName: `${nurse.firstName} ${nurse.lastName}`,
                          }))
                          .find(
                            (nurse) =>
                              nurse.userId === currentVersion.assignedTo,
                          )?.nurseName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Assigned At:
                      </span>{" "}
                      <span className="font-medium">
                        {formatDateValue(
                          getFieldValue(currentVersion, "assignedAt"),
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Follow Up:</span>{" "}
                      <span className="font-medium">
                        {currentVersion.fuAction || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        P2P Successful:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.p2pSuccess === 1 ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Escalated to MD:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.mdReview === 1 ? "Yes" : "No"}
                      </span>
                    </div>
                    {currentVersion.mdReview === 1 &&
                      currentVersion.physPubId && (
                        <div>
                          <span className="text-muted-foreground">
                            MD Name:
                          </span>{" "}
                          <span className="font-medium">
                            {
                              physicians.find(
                                (phys) =>
                                  phys.pubId === currentVersion.physPubId,
                              )?.name
                            }
                          </span>
                        </div>
                      )}
                    <div>
                      <span className="text-muted-foreground">
                        MD Recommendation:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.mdRecommended || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Procedure Codes:
                      </span>{" "}
                      <span className="font-medium">
                        {currentVersion.procedureCodes || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created At:</span>{" "}
                      <span className="font-medium">
                        {format(
                          currentVersion.createdAt,
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created By:</span>{" "}
                      <span className="font-medium">
                        {formatUserValue(currentVersion.createdBy)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated At:</span>{" "}
                      <span className="font-medium">
                        {format(
                          currentVersion.updatedAt,
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated By:</span>{" "}
                      <span className="font-medium">
                        {formatUserValue(currentVersion.updatedBy)}
                      </span>
                    </div>
                  </div>
                  {currentVersion.remarks && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Remarks:</span>{" "}
                      <span className="font-medium">
                        {currentVersion.remarks}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Newer
            </Button>
            <span className="text-sm text-muted-foreground">
              {isCurrentVersion
                ? "Viewing current version"
                : `Viewing change ${versions.length - currentIndex} of ${versions.length}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentIndex(Math.min(versions.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === versions.length - 1}
            >
              Older
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
