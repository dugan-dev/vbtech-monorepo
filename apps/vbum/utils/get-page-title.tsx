import {
  AdminClients,
  AdminHealthPlans,
  AdminPhysicians,
  AdminUsers,
  Dashboard,
  Home,
  RateLimit,
} from "@/routes";

/**
 * Return the user-facing title for a given route pathname.
 *
 * @returns The display title for the matched route, or an empty string when no title should be shown (for example, the `RateLimit` route).
 *
 * @throws Error if `pathname` does not match any recognized route.
 */
export function getPageTitle(pathname: string, slug?: string) {
  switch (pathname) {
    case Home({}):
      return "Cases";
    case AdminUsers({}):
      return "User Administration";
    case AdminClients({}):
      return "Manage Clients";
    case AdminHealthPlans({}):
      return "Manage Health Plans";
    case AdminPhysicians({}):
      return "Manage Physicians";
    case Dashboard({}):
      return "Dashboard";
    case RateLimit({ secs: 0 }):
      return "";
    default:
      throw new Error(`Get page title: Unknown pathname: ${pathname}`);
  }
}
