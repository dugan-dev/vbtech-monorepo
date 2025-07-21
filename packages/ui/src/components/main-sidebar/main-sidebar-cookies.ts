// Cookie utilities for state persistence
export const COOKIE_MAX_AGE = 60 * 10; // 10 minutes

/**
 * Generates a normalized cookie name for storing sidebar collapsible state, scoped by the given application title.
 *
 * The generated name is lowercased and spaces are replaced with hyphens to ensure consistency.
 *
 * @param appTitle - The title of the application used to scope the cookie name.
 * @returns The normalized cookie name for the sidebar state.
 */

export function getCookieName(appTitle: string): string {
  const cookieName = `sidebar-collapsible-state-${appTitle.toLowerCase().replace(/\s+/g, "-")}`;
  // Debug log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[MainSidebar] Cookie name for "${appTitle}": ${cookieName}`);
  }
  return cookieName;
}

/**
 * Retrieves the sidebar state from a cookie associated with the given app title.
 *
 * Returns an object representing the sidebar's collapsed state, or an empty object if the cookie is missing, malformed, or not accessible.
 *
 * @param appTitle - The application title used to scope the cookie.
 * @returns An object mapping sidebar keys to their collapsed state.
 */
export function getCookieValue(appTitle: string): Record<string, boolean> {
  if (typeof document === "undefined") return {};

  const cookieName = getCookieName(appTitle);
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${cookieName}=`));

  if (!cookie) return {};

  try {
    const value = cookie.split("=")[1];
    if (!value) return {};
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return {};
  }
}

/**
 * Sets the sidebar state cookie for the specified application title.
 *
 * Stores the provided state object as a JSON-encoded, URI-encoded cookie value, scoped by the normalized app title. The cookie is set with a 10-minute expiration, path `/`, `SameSite=lax`, and the `secure` flag if using HTTPS.
 *
 * @param appTitle - The application title used to scope the cookie name.
 * @param value - The sidebar state to persist.
 */
export function setCookieValue(
  appTitle: string,
  value: Record<string, boolean>,
): void {
  if (typeof document === "undefined") return;

  const cookieName = getCookieName(appTitle);
  const cookieValue = encodeURIComponent(JSON.stringify(value));
  const secure = location.protocol === "https:" ? "; secure;" : "";
  document.cookie = `${cookieName}=${cookieValue}; path=/; max-age=${COOKIE_MAX_AGE} sameSite=lax${secure}`;
}

/**
 * Removes the sidebar state cookie associated with the specified app title.
 *
 * Call this function to reset the sidebar state, such as when a user logs out.
 *
 * @param appTitle - The title of the application whose sidebar state cookie should be cleared.
 */
export function clearSidebarState(appTitle: string): void {
  if (typeof document === "undefined") return;

  const cookieName = getCookieName(appTitle);
  const secure = location.protocol === "https:" ? "; secure;" : "";
  // Clear the cookie by setting it to expire in the past
  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT sameSite=lax${secure}`;
}
