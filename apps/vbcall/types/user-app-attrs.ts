import { UserMode } from "@/types/user-mode";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

export type UserAppAttrs = {
  app: string;
  super: boolean;
  admin: boolean;
  type: UserType;
  ids?: {
    id: string;
    userMode: UserMode;
    userRoles: UserRole[];
  }[];
  slug?: string;
};
