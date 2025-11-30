import { z } from "zod";

type CaseFollowUpAction =
  | "N/A"
  | "Asking for more Information"
  | "P2P Offer - Outbound #1"
  | "P2P Offer - Outbound #2"
  | "P2P Scheduled";

const CaseFollowUpActions = [
  "N/A",
  "Asking for more Information",
  "P2P Offer - Outbound #1",
  "P2P Offer - Outbound #2",
  "P2P Scheduled",
] as const;

const CaseFollowUpActionEnum = z.enum(CaseFollowUpActions);

const CaseFollowUpActionLabels = {
  "N/A": "N/A",
  "Asking for more Information": "Asking for more Information",
  "P2P Offer - Outbound #1": "P2P Offer - Outbound #1",
  "P2P Offer - Outbound #2": "P2P Offer - Outbound #2",
  "P2P Scheduled": "P2P Scheduled",
};

export {
  CaseFollowUpActionEnum,
  CaseFollowUpActions,
  CaseFollowUpActionLabels,
  type CaseFollowUpAction,
};
