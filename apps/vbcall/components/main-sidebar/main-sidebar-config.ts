import {
  AdminClients,
  AdminHealthPlans,
  AdminUsers,
  Agent,
  CallLog,
  Dashboard,
  Home,
} from "@/routes";

import { SidebarNavItem } from "@/types/sidebar-nav-item";
import { Icons } from "@/components/icons";

export const MAIN_SIDEBAR_CONFIG = [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Agent",
    icon: Icons.headset,
    href: Agent({}),
  },
  {
    title: "Reporting",
    icon: Icons.files,
    items: [
      {
        title: "Dashboard",
        icon: Icons.layoutDashboard,
        href: Dashboard({}),
      },
      {
        title: "Call Log",
        icon: Icons.fileAudio,
        href: CallLog({}),
      },
    ],
  },
  {
    title: "Admin",
    icon: Icons.wrench,
    isAdminOnly: true,
    items: [
      {
        title: "Users",
        icon: Icons.users,
        href: AdminUsers({}),
        isAdminOnly: true,
      },
      {
        title: "Clients",
        icon: Icons.handshake,
        href: AdminClients({}),
        isAdminOnly: true,
      },
      {
        title: "Health Plans",
        icon: Icons.heartHandshake,
        href: AdminHealthPlans({}),
        isAdminOnly: true,
      },
    ],
  },
] as SidebarNavItem[];
