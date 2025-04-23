"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { signOut } from "aws-amplify/auth";

export function useAutoLogout(minutes = 10) {
  const router = useRouter();
  const timeout = minutes * 60 * 1000;

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(async () => {
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
  }, [router, timeout]);
}
