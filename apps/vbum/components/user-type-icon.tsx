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
