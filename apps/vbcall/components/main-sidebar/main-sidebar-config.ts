import {
  AdminClients,
  AdminHealthPlans,
  AdminUsers,
  Agent,
  CallLog,
  Dashboard,
  Home,
} from "@/routes";
import {
  File,
  Handshake,
  Headset,
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
    title: "Agent",
    icon: Headset,
    href: Agent({}),
  },
  {
    id: "3",
    title: "Reporting",
    icon: File,
    items: [
      {
        id: "3.1",
        title: "Dashboard",
        icon: LayoutDashboard,
        href: Dashboard({}),
      },
      {
        id: "3.2",
        title: "Call Log",
        icon: File,
        href: CallLog({}),
      },
    ],
  },
  {
    id: "4",
    title: "Admin",
    icon: Wrench,
    isAdminOnly: true,
    items: [
      {
        id: "4.1",
        title: "Users",
        icon: Users,
        href: AdminUsers({}),
        isAdminOnly: true,
      },
      {
        id: "4.2",
        title: "Clients",
        icon: Handshake,
        href: AdminClients({}),
        isAdminOnly: true,
      },
      {
        id: "4.3",
        title: "Health Plans",
        icon: HeartHandshake,
        href: AdminHealthPlans({}),
        isAdminOnly: true,
      },
    ],
  },
] satisfies SidebarNavItem[];
