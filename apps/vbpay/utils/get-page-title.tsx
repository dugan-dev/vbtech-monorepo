import {
  AdminSettings,
  AdminUsers,
  BeneficiariesAlignment,
  BeneficiariesAttribution,
  BeneficiariesSearch,
  Beneficiary,
  FileStatus,
  FileUpload,
  Home,
  NetworkEntities,
  NetworkPayer,
  NetworkPayers,
  NetworkPhysician,
  NetworkPhysicians,
  PaymentsCapitation,
  PaymentsClaims,
  PaymentsValueBased,
  QueuesCompleted,
  QueuesManage,
  QueuesWork,
  RecentShareNotifications,
  Setup,
  ShareFiles,
  ShareNotificationDetail,
} from "@/routes";

export function getPageTitle(pathname: string, slug?: string) {
  switch (pathname) {
    case Setup({}):
      return "Setup";
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
    case PaymentsClaims({}):
      return "Claims";
    case PaymentsCapitation({}):
      return "Capitation";
    case PaymentsValueBased({}):
      return "Value Based";
    case FileStatus({}):
      return "File Status";
    case FileUpload({}):
      return "File Upload";
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
