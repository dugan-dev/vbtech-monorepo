
import { z } from "zod";

/**
 * Represents the possible status values for a processing account.
 * Each status indicates a different stage in the account lifecycle,
 * from creation through approval to potential deactivation.
 */
type PayloadProcessingAccountStatusType =
  | "incomplete"
  | "pending"
  | "active"
  | "in_review"
  | "action_needed"
  | "resubmit"
  | "inactive";

const PayloadProcessingAccountStatuses = [
  "incomplete",
  "pending",
  "active",
  "in_review",
  "action_needed",
  "resubmit",
  "inactive",
] as const;

const PayloadProcessingAccountStatusEnum = z.enum(
  PayloadProcessingAccountStatuses,
);

const PayloadProcessingAccountStatusLabels = {
  incomplete: "Incomplete",
  pending: "Pending",
  active: "Active",
  in_review: "In Review",
  action_needed: "Action Needed",
  resubmit: "Resubmit",
  inactive: "Inactive",
};

export {
  type PayloadProcessingAccountStatusType,
  PayloadProcessingAccountStatuses,
  PayloadProcessingAccountStatusEnum,
  PayloadProcessingAccountStatusLabels,
};
