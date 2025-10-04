import {
  AdminClients,
  AdminHealthPlans,
  AdminUsers,
  Dashboard,
  Home,
} from "@/routes";
import {
  File,
  Handshake,
  HeartHandshake,
  LayoutDashboard,
  Users,
  Wrench,
} from "lucide-react";

import { SidebarNavItem } from "@workspace/ui/types/sidebar-nav-item";

export const MAIN_SIDEBAR_CONFIG = [
  {
    id: "1",
    title: "Home",
    icon: LayoutDashboard,
    href: Home({}),
  },
  {
    id: "2",
    title: "Reporting",
    icon: File,
    items: [
      {
        id: "2.1",
        title: "Dashboard",
        icon: LayoutDashboard,
        href: Dashboard({}),
      },
    ],
  },
  {
    id: "3",
    title: "Admin",
    icon: Wrench,
    isAdminOnly: true,
    items: [
      {
        id: "3.1",
        title: "Users",
        icon: Users,
        href: AdminUsers({}),
        isAdminOnly: true,
      },
      {
        id: "3.2",
        title: "Clients",
        icon: Handshake,
        href: AdminClients({}),
        isAdminOnly: true,
      },
      {
        id: "3.3",
        title: "Health Plans",
        icon: HeartHandshake,
        href: AdminHealthPlans({}),
        isAdminOnly: true,
      },
    ],
  },
] satisfies SidebarNavItem[];
