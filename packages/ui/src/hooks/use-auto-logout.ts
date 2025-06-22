"use client";

import { useEffect } from "react";

/**
 * React hook that automatically calls a callback after a specified period of inactivity.
 *
 * @param onAutoLogout - Callback to call after inactivity.
 * @param minutes - Number of minutes of inactivity before triggering. Defaults to 10.
 *
 * @remark The inactivity timer resets on user activity such as mouse movement, key presses, clicks, or scrolling.
 */
export function useAutoLogout(onAutoLogout: () => void, minutes = 10) {
  const timeout = minutes * 60 * 1000;

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(onAutoLogout, timeout);
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
  }, [minutes, onAutoLogout, timeout]);
}
