export type SidebarNavItem = {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  items?: SidebarNavItem[];
};
