import {
  AdminClients,
  AdminUsers,
  Agent,
  CallLog,
  Dashboard,
  Home,
  RateLimit,
} from "@/routes";

/**
 * Returns the display title string for a given route pathname.
 *
 * Maps the specified {@link pathname} (and optional {@link slug} for dynamic routes) to a user interface title string. If the route is not recognized, an error is thrown.
 *
 * @param pathname - The current route pathname.
 * @param slug - Optional string for resolving dynamic route segments.
 * @returns The title string corresponding to the route.
 *
 * @throws {Error} If {@link pathname} does not match any recognized route.
 *
 * @remark For the 'RateLimit' route, an empty string is returned to indicate no title should be displayed.
 */
export function getPageTitle(pathname: string, slug?: string) {
  switch (pathname) {
    case Home({}):
      return "Home";
    case AdminUsers({}):
      return "User Management";
    case AdminClients({}):
      return "Manage Clients";
    case Agent({}):
      return "Agent";
    case Dashboard({}):
      return "Dashboard";
    case CallLog({}):
      return "Call Log";
    case RateLimit({}):
      return "";
    default:
      throw new Error(`Get page title: Unknown pathname: ${pathname}`);
  }
}
