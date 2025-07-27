/**
 * Shared timeout constants for session management, cookies, and auto-logout functionality.
 * Consolidated timeout configuration with multiple time unit representations.
 */
export const timeouts = {
  autoLogout: {
    minutes: 10,
    get seconds() {
      return this.minutes * 60;
    },
    get milliseconds() {
      return this.seconds * 1000;
    },
  },
  sidebarCookie: {
    minutes: 10,
    get seconds() {
      return this.minutes * 60;
    },
  },
} as const;
