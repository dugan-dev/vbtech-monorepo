export type SidebarNavItem<TUserRole = string, TUserType = string> = {
  title: string;
  href?: string;
  items?: SidebarNavItem<TUserRole, TUserType>[];
  allowedUserTypes?: TUserType[];
  requiredRoles?: TUserRole[];
  isAdminOnly?: boolean;
  icon?: React.ElementType;
};

export type UserAttributes<TUserRole = string, TUserType = string> = {
  type: TUserType;
  roles?: TUserRole[];
  isAdmin?: boolean;
  slug?: string;
};

export type MainSidebarConfig<TUserRole = string, TUserType = string> = {
  appTitle: string;
  appVersion: string;
  navigationItems: SidebarNavItem<TUserRole, TUserType>[];
  hasLicense?: boolean;
};
