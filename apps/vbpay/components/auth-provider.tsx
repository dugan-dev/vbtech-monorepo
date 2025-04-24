"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { getCurrentUser } from "aws-amplify/auth";

import { useAutoLogout } from "@/hooks/use-auto-logout";

/**
 * Restricts access to child components to authenticated users by validating the user session.
 *
 * Verifies authentication on mount and when the page becomes visible, redirecting unauthenticated users to the sign-in page. While authentication status is being determined, renders nothing. Also enforces automatic logout after a period of inactivity.
 *
 * @param children - React nodes that require authentication to be rendered.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await getCurrentUser();
      } catch {
        router.push(SignIn({}));
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useAutoLogout(10);

  if (checkingAuth) return null;

  return <>{children}</>;
}
