import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

export type SidebarNavItem = {
  title: string;
  href?: string;
  items?: SidebarNavItem[];
  allowedUserTypes?: UserType[];
  requiredRoles?: UserRole[];
  isAdminOnly?: boolean;
  icon?: React.ElementType;
};
