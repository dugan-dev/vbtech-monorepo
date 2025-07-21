/**
 * Shared timeout constants for session management, cookies, and auto-logout functionality.
 * All values are in seconds unless otherwise specified.
 */

// Session and authentication timeouts
export const AUTO_LOGOUT_TIMEOUT_MINUTES = 10;
export const AUTO_LOGOUT_TIMEOUT_SECONDS = AUTO_LOGOUT_TIMEOUT_MINUTES * 60;

// Cookie expiration timeouts
export const SIDEBAR_COOKIE_TIMEOUT_MINUTES = 10;
export const SIDEBAR_COOKIE_TIMEOUT_SECONDS =
  SIDEBAR_COOKIE_TIMEOUT_MINUTES * 60;

// Rate limiting timeouts (if needed in the future)
export const RATE_LIMIT_WINDOW_SECONDS = 60;
export const RATE_LIMIT_WINDOW_MINUTES = 1;

// Utility functions for converting to different time units
export const timeouts = {
  autoLogout: {
    minutes: AUTO_LOGOUT_TIMEOUT_MINUTES,
    seconds: AUTO_LOGOUT_TIMEOUT_SECONDS,
    milliseconds: AUTO_LOGOUT_TIMEOUT_SECONDS * 1000,
  },
  sidebarCookie: {
    minutes: SIDEBAR_COOKIE_TIMEOUT_MINUTES,
    seconds: SIDEBAR_COOKIE_TIMEOUT_SECONDS,
  },
  rateLimit: {
    minutes: RATE_LIMIT_WINDOW_MINUTES,
    seconds: RATE_LIMIT_WINDOW_SECONDS,
  },
} as const;
