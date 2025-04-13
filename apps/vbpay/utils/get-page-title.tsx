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
  NetworkEntity,
  NetworkPayer,
  NetworkPayers,
  NetworkPhysician,
  NetworkPhysicians,
  PaymentsCapitation,
  PaymentsClaims,
  PaymentsPerformance,
  QueuesCompleted,
  QueuesManage,
  QueuesWork,
  RateLimit,
  RecentShareNotifications,
  Setup,
  ShareFiles,
  ShareNotificationDetail,
} from "@/routes";

/**
 * Returns the title associated with the specified route.
 *
 * This function maps a given pathname to its display title for use in the user interface.
 * For dynamic routes that include a slug, the provided slug is used (defaulting to an empty string if not specified),
 * ensuring the correct title is returned.
 *
 * @param pathname - A string indicating the current route.
 * @param slug - An optional string used for resolving dynamic route segments.
 * @returns A string representing the title for the corresponding route.
 *
 * @throws {Error} If the pathname does not match any recognized route.
 *
 * @remark The 'RateLimit' route explicitly returns an empty string to indicate that no title should be displayed.
 */
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
    case NetworkEntity({ slug: slug ?? "" }):
      return "Network Entity";
    case NetworkPhysician({ slug: slug ?? "" }):
      return "Network Physician";
    case PaymentsClaims({}):
      return "Claims";
    case PaymentsCapitation({}):
      return "Capitation";
    case PaymentsPerformance({}):
      return "Performance";
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
    case RateLimit({}):
      return "";
    case RecentShareNotifications({}):
      return "Recent Notifications";
    case ShareFiles({}):
      return "Share Files";
    default:
      throw new Error(`Get page title: Unknown pathname: ${pathname}`);
  }
}
