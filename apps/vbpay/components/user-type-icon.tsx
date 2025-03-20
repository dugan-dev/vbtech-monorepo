import { UserType } from "@/types/user-type";
import { Icons } from "@/components/icons";

type props = {
  userType: UserType;
};

export function UserTypeIcon({ userType }: props) {
  return userType === "physician" ? (
    <Icons.stethoscope className="size-4" />
  ) : userType === "practice" ? (
    <Icons.building className="size-4" />
  ) : userType === "facility" ? (
    <Icons.hotel className="size-4" />
  ) : userType === "po" ? (
    <Icons.building2 className="size-4" />
  ) : userType === "payer" ? (
    <Icons.heartPulse className="size-4" />
  ) : userType === "payers" ? (
    <Icons.heartPulse className="size-4" />
  ) : userType === "bpo" ? (
    <Icons.heartPulse className="size-4" />
  ) : userType === "vendor" ? (
    <Icons.hotel className="size-4" />
  ) : undefined;
}
