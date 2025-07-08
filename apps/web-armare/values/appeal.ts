import type { AppealStep } from "@/types/appeal";

export const APPEAL_STEPS: AppealStep[] = [
  {
    step: 1,
    title: "Initial Review Period",
    description:
      "30 days from receipt of determination letter to submit additional documentation or request reconsideration.",
  },
  {
    step: 2,
    title: "Formal Appeal",
    description:
      "Submit written appeal with supporting documentation within 60 days of final determination.",
  },
  {
    step: 3,
    title: "Independent Review",
    description:
      "Cases undergo independent clinical review by qualified healthcare professionals.",
  },
];
