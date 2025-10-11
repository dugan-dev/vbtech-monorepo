import {
  FileText,
  HeartPulse,
  ShieldCheck,
  SquareActivity,
} from "lucide-react";

import { UserType } from "@/types/user-type";

type props = {
  userType: UserType;
};

/**
 * Render an icon that corresponds to a user type.
 *
 * @param userType - The user type to display an icon for. For:
 *   - `"nurse"` → HeartPulse icon
 *   - `"ops"` → SquareActivity icon
 *   - `"auditor"` → ShieldCheck icon
 *   - `"reporting"` → FileText icon
 * @returns The icon element matching `userType`, or `null` if there is no match.
 */
export function UserTypeIcon({ userType }: props) {
  return userType === "nurse" ? (
    <HeartPulse className="size-4" />
  ) : userType === "ops" ? (
    <SquareActivity className="size-4" />
  ) : userType === "auditor" ? (
    <ShieldCheck className="size-4" />
  ) : userType === "reporting" ? (
    <FileText className="size-4" />
  ) : null;
}
