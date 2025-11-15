"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { umCase } from "@/types/um-case";

import { CaseFormDefaultValues, CaseFormInput } from "./case-form-schema";
import { CaseReviewSheet } from "./case-review-sheet";

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

function umCaseToFormData(caseData: umCase): CaseFormInput {
  const formData: CaseFormInput = {
    assignedTo: caseData.assignedTo || "",
    caseId: caseData.caseNumber,
    procedureCode: caseData.procedureCode || "",
    clientPubId: caseData.clientPubId,
    planPubId: caseData.planPubId,
    status: caseData.status,
    escalatedToMD: caseData.mdReview === 1 ? "Yes" : "No",
    mdName: caseData.mdName || "",
    followUpAction: caseData.fuAction || "",
    p2pSuccessful: caseData.p2pSuccess === 1 ? "Yes" : "No",
    remarks: caseData.remarks || "",
  };
  return formData;
}

export function WorklistTable({ cases, type }: props) {
  const [selectedCase, setSelectedCase] = useState<umCase | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const handleReviewCase = (caseData: any) => {
    setSelectedCase(caseData);
    setIsReviewDialogOpen(true);
  };

  if (type === "open") {
    return (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Health Plan</TableHead>
                <TableHead>Procedure Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Follow Up Action</TableHead>
                <TableHead>MD Escalation</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No cases found.
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((case_) => (
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
                    <TableCell className="font-mono text-sm">
                      {case_.procedureCode || "—"}
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
                          <span className="text-sm">{case_.mdName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {case_.remarks || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviewCase(case_)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <CaseReviewSheet
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          values={
            selectedCase
              ? umCaseToFormData(selectedCase)
              : CaseFormDefaultValues
          }
          casePubId={selectedCase?.pubId || ""}
        />
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Health Plan</TableHead>
              <TableHead>Procedure Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Closed Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No closed cases found.
                </TableCell>
              </TableRow>
            ) : (
              cases.map((case_) => (
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
                  <TableCell className="font-mono text-sm">
                    {case_.procedureCode || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {case_.status === "Closed"
                      ? new Date(case_.updatedAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {case_.remarks || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReviewCase(case_)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CaseReviewSheet
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        values={
          selectedCase ? umCaseToFormData(selectedCase) : CaseFormDefaultValues
        }
        casePubId={selectedCase?.pubId || ""}
      />
    </>
  );
}
