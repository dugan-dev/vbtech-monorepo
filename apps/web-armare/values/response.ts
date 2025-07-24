import type { ResponseRequirement } from "@/types/response";

export const RESPONSE_REQUIREMENTS: ResponseRequirement[] = [
  {
    title: "Response Deadline",
    content: "30 Days",
    color: "red",
  },
  {
    title: "Documentation Required",
    content: ["Complete medical records", "Supporting documentation"],
    color: "orange",
  },
  {
    title: "Submission Methods",
    content: ["Secure email", "Secure fax", "Certified mail"],
    color: "blue",
  },
];
