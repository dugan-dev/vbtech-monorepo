import {
  AdminClients,
  AdminHealthPlans,
  AdminUsers,
  Agent,
  CallLog,
  Dashboard,
  Home,
  RateLimit,
} from "@/routes";

/**
 * Returns the user interface title string for a given route pathname.
 *
 * Maps the provided {@link pathname} to a display title for recognized routes. Throws an error if the route is not recognized.
 *
 * @returns The title string for the matched route, or an empty string if no title should be displayed.
 *
 * @throws {Error} If {@link pathname} does not match any recognized route.
 *
 * @remark Returns an empty string for the 'RateLimit' route to indicate no title should be shown.
 */
export function getPageTitle(pathname: string, slug?: string) {
  switch (pathname) {
    case Home({}):
      return "Home";
    case AdminUsers({}):
      return "User Management";
    case AdminClients({}):
      return "Manage Clients";
    case AdminHealthPlans({}):
      return "Manage Health Plans";
    case Agent({}):
      return "Agent";
    case Dashboard({}):
      return "Dashboard";
    case CallLog({}):
      return "Call Log";
    case RateLimit({ secs: 0 }):
      return "";
    default:
      throw new Error(`Get page title: Unknown pathname: ${pathname}`);
  }
}
