"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";

import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar-cookies";

import { timeouts } from "../constants/session-timeouts";
import { AutoLogoutConfig } from "../types/auth/auth-config";

/**
 * React hook that automatically signs out the user after a specified period of inactivity and redirects to the sign-in page.
 *
 * @param config - Configuration object containing app name and sign-in path
 * @param minutes - Number of minutes of inactivity before triggering automatic logout. Defaults to the configured timeout.
 *
 * @remark The inactivity timer resets on user activity such as mouse movement, key presses, clicks, or scrolling.
 */
export function useAutoLogout(
  config: AutoLogoutConfig,
  minutes = timeouts.autoLogout.minutes,
) {
  const router = useRouter();
  const timeout = minutes * 60 * 1000;

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;
    let lastActivity = Date.now();

    const resetTimer = () => {
      const now = Date.now();
      // Throttle timer resets to avoid excessive timer clearing/setting
      if (now - lastActivity < 1000) return; // Only reset if more than 1 second since last activity

      lastActivity = now;
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
        try {
          clearSidebarState(config.appName);
          await signOut();
          router.push(config.signInPath);
        } catch (error) {
          console.error("Auto logout failed:", error);
          // Still redirect to sign-in even if signOut fails
          router.push(config.signInPath);
        }
      }, timeout);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [config.appName, config.signInPath, minutes, router, timeout]);
}
