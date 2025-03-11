import {
  ActivitySchedule,
  ActivityStatus,
  ActivityUpload,
  AdminSettings,
  AdminUsers,
  BeneficiariesAlignment,
  BeneficiariesAttribution,
  BeneficiariesSearch,
  Beneficiary,
  Home,
  NetworkEntities,
  NetworkPayer,
  NetworkPayers,
  NetworkPhysician,
  NetworkPhysicians,
  QueuesCompleted,
  QueuesManage,
  QueuesWork,
  RecentShareNotifications,
  ShareFiles,
  ShareNotificationDetail,
} from "@/routes";

export function getPageTitle(pathname: string, slug?: string) {
  switch (pathname) {
    case Home({}):
      return "Home";
    case NetworkEntities({}):
      return "Manage Network Entities";
    case NetworkPayers({}):
      return "Manage Payers";
    case NetworkPhysicians({}):
      return "Manage Network Physicians";
    case NetworkPayer({ slug: slug ?? "" }):
      return "Network Payer";
    case ActivitySchedule({}):
      return "Activity Schedule";
    case ActivityStatus({}):
      return "Activity Status";
    case ActivityUpload({}):
      return "Activity Upload";
    case AdminSettings({}):
      return "Settings";
    case AdminUsers({}):
      return "User Management";
    case BeneficiariesSearch({}):
      return "Beneficiary Search";
    case BeneficiariesAlignment({}):
      return "Beneficiary Alignment";
    case BeneficiariesAttribution({}):
      return "Beneficiary Attribution";
    case Beneficiary({ slug: slug ?? "" }):
      return "Overview";
    case NetworkPhysician({ slug: slug ?? "" }):
      return "Overview";
    case QueuesCompleted({}):
      return "Completed Work";
    case QueuesManage({}):
      return "Manage Queues";
    case QueuesWork({}):
      return "Work Queues";
    case ShareNotificationDetail({ slug: slug ?? "" }):
      return "Share Notification Detail";
    case RecentShareNotifications({}):
      return "Recent Notifications";
    case ShareFiles({}):
      return "Share Files";
    default:
      return "Home";
  }
}
