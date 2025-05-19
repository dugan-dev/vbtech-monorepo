import { UserType } from "@/types/user-type";
import { Icons } from "@/components/icons";

type props = {
  userType: UserType;
};

export function UserTypeIcon({ userType }: props) {
  return userType === "internal" ? (
    <Icons.headset className="size-4" />
  ) : undefined;
}
