import {
  AdminClients,
  AdminHealthPlans,
  AdminUsers,
  Agent,
  CallLog,
  Dashboard,
  Home,
} from "@/routes";

import { SidebarNavItem } from "@workspace/ui/types/sidebar-nav-item";

import { Icons } from "@/components/icons";

export const MAIN_SIDEBAR_CONFIG = [
  {
    id: 1,
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    id: 2,
    title: "Agent",
    icon: Icons.headset,
    href: Agent({}),
  },
  {
    id: 3,
    title: "Reporting",
    icon: Icons.files,
    items: [
      {
        id: 3.1,
        title: "Dashboard",
        icon: Icons.layoutDashboard,
        href: Dashboard({}),
      },
      {
        id: 3.2,
        title: "Call Log",
        icon: Icons.fileAudio,
        href: CallLog({}),
      },
    ],
  },
  {
    id: 4,
    title: "Admin",
    icon: Icons.wrench,
    isAdminOnly: true,
    items: [
      {
        id: 4.1,
        title: "Users",
        icon: Icons.users,
        href: AdminUsers({}),
        isAdminOnly: true,
      },
      {
        id: 4.2,
        title: "Clients",
        icon: Icons.handshake,
        href: AdminClients({}),
        isAdminOnly: true,
      },
      {
        id: 4.3,
        title: "Health Plans",
        icon: Icons.heartHandshake,
        href: AdminHealthPlans({}),
        isAdminOnly: true,
      },
    ],
  },
] satisfies SidebarNavItem[];
