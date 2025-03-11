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

const MAIN_SIDEBAR_ITEMS_BPO: SidebarNavItem[] = [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      {
        title: "Status",
        href: ActivityStatus({}),
        icon: Icons.cpu,
      },
      {
        title: "Upload",
        href: ActivityUpload({}),
        icon: Icons.diff,
      },
    ],
  },
  {
    title: "Queues",
    icon: Icons.layers,
    items: [
      { title: "Manage", href: QueuesManage({}), icon: Icons.barChartBig },
      { title: "Work", href: QueuesWork({}), icon: Icons.layers },
      {
        title: "Completed",
        href: QueuesCompleted({}),
        icon: Icons.clipboardCheck,
      },
    ],
  },
  {
    title: "Network",
    icon: Icons.network,
    items: [
      { title: "Payers", href: NetworkPayers({}), icon: Icons.heartPulse },
      {
        title: "Network Entities",
        href: NetworkEntities({}),
        icon: Icons.building2,
      },
      {
        title: "Physicians",
        href: NetworkPhysicians({}),
        icon: Icons.stethoscope,
      },
    ],
  },
  {
    title: "Beneficiaries",
    icon: Icons.users,
    items: [
      {
        title: "Search",
        href: BeneficiariesSearch({}),
        icon: Icons.search,
      },
      {
        title: "Alignment",
        href: BeneficiariesAlignment({}),
        icon: Icons.bookHeart,
      },
      {
        title: "Attribution",
        href: BeneficiariesAttribution({}),
        icon: Icons.clipboardList,
      },
    ],
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
  {
    title: "Admin",
    icon: Icons.wrench,
    items: [
      { title: "Settings", href: AdminSettings({}), icon: Icons.settings },
      { title: "Users", href: AdminUsers({}), icon: Icons.users },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_PAYERS = [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Network",
    icon: Icons.network,
    items: [
      { title: "Payers", href: NetworkPayers({}), icon: Icons.heartPulse },
      {
        title: "Network Entities",
        href: NetworkEntities({}),
        icon: Icons.building2,
      },
      {
        title: "Physicians",
        href: NetworkPhysicians({}),
        icon: Icons.stethoscope,
      },
    ],
  },
  {
    title: "Beneficiaries",
    icon: Icons.users,
    items: [
      {
        title: "Search",
        href: BeneficiariesSearch({}),
        icon: Icons.search,
      },
      {
        title: "Alignment",
        href: BeneficiariesAlignment({}),
        icon: Icons.bookHeart,
      },
      {
        title: "Attribution",
        href: BeneficiariesAttribution({}),
        icon: Icons.clipboardList,
      },
    ],
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_PAYER = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Payer",
    icon: Icons.heartPulse,
    href: NetworkPayer({ slug }),
  },
  {
    title: "Network",
    icon: Icons.network,
    items: [
      { title: "Payers", href: NetworkPayers({}), icon: Icons.heartPulse },
      {
        title: "Network Entities",
        href: NetworkEntities({}),
        icon: Icons.building2,
      },
      {
        title: "Physicians",
        href: NetworkPhysicians({}),
        icon: Icons.stethoscope,
      },
    ],
  },
  {
    title: "Beneficiaries",
    icon: Icons.users,
    items: [
      {
        title: "Search",
        href: BeneficiariesSearch({}),
        icon: Icons.search,
      },
      {
        title: "Alignment",
        href: BeneficiariesAlignment({}),
        icon: Icons.bookHeart,
      },
      {
        title: "Attribution",
        href: BeneficiariesAttribution({}),
        icon: Icons.clipboardList,
      },
    ],
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_PO = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Physician Org",
    icon: Icons.building2,
    href: NetworkEntity({ slug }),
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_PRACTICE = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Practice",
    icon: Icons.building,
    href: NetworkEntity({ slug }),
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_FACILITY = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Facility",
    icon: Icons.hotel,
    href: NetworkEntity({ slug }),
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_VENDOR = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Vendor",
    icon: Icons.store,
    href: NetworkEntity({ slug }),
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

const MAIN_SIDEBAR_ITEMS_PHYSICIAN = (slug: string) => [
  {
    title: "Home",
    icon: Icons.layoutDashboard,
    href: Home({}),
  },
  {
    title: "Activity",
    icon: Icons.calendarCheck,
    items: [
      {
        title: "Schedule",
        href: ActivitySchedule({}),
        icon: Icons.calendar,
      },
      { title: "Status", href: ActivityStatus({}), icon: Icons.cpu },
      { title: "Upload", href: ActivityUpload({}), icon: Icons.diff },
    ],
  },
  {
    title: "Physician",
    icon: Icons.stethoscope,
    href: NetworkPhysician({ slug }),
  },
  {
    title: "Share",
    icon: Icons.share,
    items: [
      { title: "Files", href: ShareFiles({}), icon: Icons.files },
      {
        title: "Notifications",
        href: RecentShareNotifications({}),
        icon: Icons.bell,
      },
    ],
  },
];

export {
  MAIN_SIDEBAR_ITEMS_BPO,
  MAIN_SIDEBAR_ITEMS_FACILITY,
  MAIN_SIDEBAR_ITEMS_PAYER,
  MAIN_SIDEBAR_ITEMS_PAYERS,
  MAIN_SIDEBAR_ITEMS_PHYSICIAN,
  MAIN_SIDEBAR_ITEMS_PO,
  MAIN_SIDEBAR_ITEMS_PRACTICE,
  MAIN_SIDEBAR_ITEMS_VENDOR,
  type SidebarNavItem,
};
