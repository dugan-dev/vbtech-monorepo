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
  ManagePaymentBatches,
  ManagePaymentRates,
  NetworkEntities,
  NetworkEntity,
  NetworkPayer,
  NetworkPayers,
  NetworkPhysician,
  NetworkPhysicians,
  PaymentPlanning,
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
 * Returns the display title string for a given route pathname.
 *
 * Maps the specified {@link pathname} (and optional {@link slug} for dynamic routes) to a user interface title. Used to provide human-readable titles for recognized application routes.
 *
 * @param pathname - The route pathname to resolve.
 * @param slug - Optional dynamic segment for routes requiring a slug.
 * @returns The title string corresponding to the route, or an empty string if no title should be displayed.
 *
 * @throws {Error} If {@link pathname} does not match any known route.
 *
 * @remark The 'RateLimit' route returns an empty string to indicate no title should be shown.
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
    case ManagePaymentRates({}):
      return "Manage Payment Rates";
    case ManagePaymentBatches({}):
      return "Manage Payment Batches";
    case PaymentPlanning({}):
      return "Payment Planning";
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
