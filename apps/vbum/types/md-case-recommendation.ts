import { z } from "zod";

type MDCaseRecommendation = "Offer P2P" | "Approve" | "Deny";

const MDCaseRecommendations = ["Offer P2P", "Approve", "Deny"] as const;

const MDCaseRecommendationEnum = z.enum(MDCaseRecommendations);

const MDCaseRecommendationLabels = {
  "Offer P2P": "Offer P2P",
  Approve: "Approve",
  Deny: "Deny",
};

export {
  MDCaseRecommendationEnum,
  MDCaseRecommendations,
  MDCaseRecommendationLabels,
  type MDCaseRecommendation,
};
