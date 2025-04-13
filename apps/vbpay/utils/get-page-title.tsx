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
 * Returns a user-friendly page title based on the provided route pathname and optional slug.
 *
 * The function matches the given pathname against predefined route patterns and returns the
 * appropriate title for display. For routes that include dynamic segments, the optional slug
 * is used (defaulting to an empty string if not provided). Notably, for the RateLimit route,
 * an empty string is returned.
 *
 * @param pathname - The route pathname used to determine the corresponding page title.
 * @param slug - An optional dynamic segment for routes requiring additional context.
 * @returns The title corresponding to the provided pathname.
 *
 * @throws {Error} If the pathname does not match any recognized route.
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
