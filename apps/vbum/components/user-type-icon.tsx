import { Headset } from "lucide-react";

import { UserType } from "@/types/user-type";

type props = {
  userType: UserType;
};

export function UserTypeIcon({ userType }: props) {
  return userType === "internal" ? <Headset className="size-4" /> : undefined;
}
