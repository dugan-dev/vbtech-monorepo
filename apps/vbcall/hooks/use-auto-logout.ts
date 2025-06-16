"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { signOut } from "aws-amplify/auth";

import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar-cookies";

/**
 * React hook that automatically signs out the user after a specified period of inactivity and redirects to the sign-in page.
 *
 * @param minutes - Number of minutes of inactivity before triggering automatic logout. Defaults to 10.
 *
 * @remark The inactivity timer resets on user activity such as mouse movement, key presses, clicks, or scrolling.
 */
export function useAutoLogout(minutes = 10) {
  const router = useRouter();
  const timeout = minutes * 60 * 1000;

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
        clearSidebarState("VB Call");
        await signOut();
        router.push(SignIn({}));
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
  }, [timeout]);
}
