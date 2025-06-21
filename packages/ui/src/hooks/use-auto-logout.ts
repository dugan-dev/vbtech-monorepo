"use client";

import { useEffect } from "react";

type props = {
  signOut: () => Promise<void>;
  minutes?: number;
  onLogout?: () => void;
  clearSidebarState?: (appName: string) => void;
  appName?: string;
};

/**
 * React hook that automatically signs out the user after a specified period of inactivity.
 *
 * @param signOut - Function to sign out the user
 * @param minutes - Number of minutes of inactivity before triggering automatic logout. Defaults to 10.
 * @param onLogout - Optional callback function to execute after logout.
 * @param clearSidebarState - Optional function to clear sidebar state.
 * @param appName - Optional app name for sidebar state clearing.
 *
 * @remark The inactivity timer resets on user activity such as mouse movement, key presses, clicks, or scrolling.
 */
export function useAutoLogout({
  signOut,
  minutes = 10,
  onLogout,
  clearSidebarState,
  appName,
}: props) {
  const timeout = minutes * 60 * 1000;

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
        if (clearSidebarState && appName) {
          clearSidebarState(appName);
        }
        await signOut();
        if (onLogout) {
          onLogout();
        }
      }, timeout);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer),
    );

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [timeout, signOut, onLogout, clearSidebarState, appName]);
}
