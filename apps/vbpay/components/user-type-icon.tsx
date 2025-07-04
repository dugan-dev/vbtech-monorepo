import {
  Building,
  Building2,
  HeartPulse,
  Hotel,
  Stethoscope,
} from "lucide-react";

import { UserType } from "@/types/user-type";

type props = {
  userType: UserType;
};

export function UserTypeIcon({ userType }: props) {
  return userType === "physician" ? (
    <Stethoscope className="size-4" />
  ) : userType === "practice" ? (
    <Building className="size-4" />
  ) : userType === "facility" ? (
    <Hotel className="size-4" />
  ) : userType === "po" ? (
    <Building2 className="size-4" />
  ) : userType === "payer" ? (
    <HeartPulse className="size-4" />
  ) : userType === "payers" ? (
    <HeartPulse className="size-4" />
  ) : userType === "bpo" ? (
    <HeartPulse className="size-4" />
  ) : userType === "vendor" ? (
    <Hotel className="size-4" />
  ) : undefined;
}
