import { z } from "zod";

type CaseStatus =
  | "Not Reviewed"
  | "Under Review"
  | "Moved to MD"
  | "Offered P2P"
  | "P2P Scheduled"
  | "Approved"
  | "Withdrawn"
  | "Denied";

const CaseStatuses = [
  "Not Reviewed",
  "Under Review",
  "Moved to MD",
  "Offered P2P",
  "P2P Scheduled",
  "Approved",
  "Withdrawn",
  "Denied",
] as const;

const ClosedCaseStatuses = ["Approved", "Withdrawn", "Denied"] as CaseStatus[];

const CaseStatusEnum = z.enum(CaseStatuses);

const CaseStatusLabels = {
  "Not Reviewed": "Not Reviewed",
  "Under Review": "Under Review",
  "Moved to MD": "Moved to MD",
  "Offered P2P": "Offered P2P",
  "P2P Scheduled": "P2P Scheduled",
  Approved: "Approved",
  Withdrawn: "Withdrawn",
  Denied: "Denied",
};

export {
  CaseStatusEnum,
  CaseStatuses,
  ClosedCaseStatuses,
  CaseStatusLabels,
  type CaseStatus,
};
