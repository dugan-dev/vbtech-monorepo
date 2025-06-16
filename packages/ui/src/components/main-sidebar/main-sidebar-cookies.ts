// Cookie utilities for state persistence
export const COOKIE_MAX_AGE = 60 * 15; // 15 minutes (5 minutes after auto-logout)

export function getCookieName(appTitle: string): string {
  const cookieName = `sidebar-collapsible-state-${appTitle.toLowerCase().replace(/\s+/g, "-")}`;
  // Debug log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[MainSidebar] Cookie name for "${appTitle}": ${cookieName}`);
  }
  return cookieName;
}

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
 * Clears the sidebar collapsible state cookie for a specific app.
 * Call this function when the user logs out to reset the sidebar state.
 */
export function clearSidebarState(appTitle: string): void {
  if (typeof document === "undefined") return;

  const cookieName = getCookieName(appTitle);
  const secure = location.protocol === "https:" ? "; secure;" : "";
  // Clear the cookie by setting it to expire in the past
  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT sameSite=lax${secure}`;
}
