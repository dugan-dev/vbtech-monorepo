import {
  ActivitySchedule,
  ActivityStatus,
  ActivityUpload,
  AdminSettings,
  AdminUsers,
  BeneficiariesAlignment,
  BeneficiariesAttribution,
  BeneficiariesSearch,
  Home,
  NetworkEntities,
  NetworkEntity,
  NetworkPayer,
  NetworkPayers,
  NetworkPhysician,
  NetworkPhysicians,
  QueuesCompleted,
  QueuesManage,
  QueuesWork,
  RecentShareNotifications,
  ShareFiles,
} from "@/routes";

import { SidebarNavItem } from "@/types/sidebar-nav-item";
import { Icons } from "@/components/icons";

export const MAIN_SIDEBAR_CONFIG = (slug?: string) =>
  [
    {
      title: "Home",
      icon: Icons.layoutDashboard,
      href: Home({}),
      allowedUserTypes: [
        "bpo",
        "payers",
        "payer",
        "po",
        "practice",
        "facility",
        "vendor",
        "physician",
      ],
    },
    {
      title: "Activity",
      icon: Icons.calendarCheck,
      items: [
        {
          title: "Schedule",
          icon: Icons.calendar,
          href: ActivitySchedule({}),
          allowedUserTypes: [
            "bpo",
            "payers",
            "payer",
            "po",
            "practice",
            "facility",
            "vendor",
            "physician",
          ],
        },
        {
          title: "Status",
          icon: Icons.cpu,
          href: ActivityStatus({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
        },
        {
          title: "Upload",
          icon: Icons.diff,
          href: ActivityUpload({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
          requiredRoles: ["upload"],
        },
      ],
    },
    {
      title: "Queues",
      icon: Icons.layers,
      items: [
        {
          title: "Manage",
          icon: Icons.barChartBig,
          href: QueuesManage({}),
          allowedUserTypes: ["bpo"],
        },
        {
          title: "Work",
          icon: Icons.layers,
          href: QueuesWork({}),
          allowedUserTypes: ["bpo"],
        },
        {
          title: "Completed",
          icon: Icons.clipboardCheck,
          href: QueuesCompleted({}),
          allowedUserTypes: ["bpo"],
        },
      ],
    },
    {
      title: "Payer",
      icon: Icons.heartPulse,
      href: NetworkPayer({ slug: slug || "" }),
      allowedUserTypes: ["payer"],
    },
    {
      title: "Physician Org",
      icon: Icons.building2,
      href: NetworkEntity({ slug: slug || "" }),
      allowedUserTypes: ["po"],
    },
    {
      title: "Practice",
      icon: Icons.building,
      href: NetworkEntity({ slug: slug || "" }),
      allowedUserTypes: ["practice"],
    },
    {
      title: "Facility",
      icon: Icons.hotel,
      href: NetworkEntity({ slug: slug || "" }),
      allowedUserTypes: ["facility"],
    },
    {
      title: "Vendor",
      icon: Icons.store,
      href: NetworkEntity({ slug: slug || "" }),
      allowedUserTypes: ["vendor"],
    },
    {
      title: "Physician",
      icon: Icons.stethoscope,
      href: NetworkPhysician({ slug: slug || "" }),
      allowedUserTypes: ["physician"],
    },
    {
      title: "Network",
      icon: Icons.network,
      items: [
        {
          title: "Payers",
          icon: Icons.heartPulse,
          href: NetworkPayers({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
        },
        {
          title: "Network Entities",
          icon: Icons.building2,
          href: NetworkEntities({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
        },
        {
          title: "Physicians",
          icon: Icons.stethoscope,
          href: NetworkPhysicians({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
        },
      ],
    },
    {
      title: "Beneficiaries",
      icon: Icons.users,
      items: [
        {
          title: "Search",
          icon: Icons.search,
          href: BeneficiariesSearch({}),
          allowedUserTypes: ["bpo", "payers", "payer"],
        },
        {
          title: "Alignment",
          icon: Icons.bookHeart,
          href: BeneficiariesAlignment({}),
        },
        {
          title: "Attribution",
          icon: Icons.clipboardList,
          href: BeneficiariesAttribution({}),
        },
      ],
    },
    {
      title: "Share",
      icon: Icons.share,
      items: [
        {
          title: "Files",
          icon: Icons.files,
          href: ShareFiles({}),
          allowedUserTypes: [
            "bpo",
            "payers",
            "payer",
            "po",
            "practice",
            "facility",
            "vendor",
            "physician",
          ],
          requiredRoles: ["read-files", "write-files"],
        },
        {
          title: "Notifications",
          icon: Icons.bell,
          href: RecentShareNotifications({}),
          allowedUserTypes: [
            "bpo",
            "payers",
            "payer",
            "po",
            "practice",
            "facility",
            "vendor",
            "physician",
          ],
          requiredRoles: ["read-notifications", "write-notifications"],
        },
      ],
    },
    {
      title: "Admin",
      icon: Icons.wrench,
      items: [
        {
          title: "Settings",
          icon: Icons.settings,
          href: AdminSettings({}),
          isAdminOnly: true,
        },
        {
          title: "Users",
          icon: Icons.users,
          href: AdminUsers({}),
          isAdminOnly: true,
        },
      ],
    },
  ] as SidebarNavItem[];
