
import { PayloadProcessingAccountStatusType } from "@/types/payload-processing-account-status";

/**
 * Returns the appropriate CSS color classes for a processing account status.
 * Maps different status values to corresponding Tailwind CSS background and text color classes.
 *
 * @param status - The processing account status to get colors for.
 *                 Possible values: "incomplete", "pending", "active",
 *                 "in_review", "action_needed", "resubmit", "inactive".
 * @returns A string of CSS class names for styling the status display.
 */
export const getProcessingAccountStatusColor = (
  status: PayloadProcessingAccountStatusType,
) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "in_review":
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "resubmit":
    case "action_needed":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};
