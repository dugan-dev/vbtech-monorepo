"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { getCurrentUser } from "aws-amplify/auth";

import { useAutoLogout } from "@/hooks/use-auto-logout";

/**
 * Restricts access to child components by verifying user authentication and session validity.
 *
 * Checks the user session on mount and whenever the page becomes visible, redirecting unauthenticated users to the sign-in page. While authentication is being verified, renders nothing. Also triggers automatic logout after a period of inactivity.
 *
 * @param children - React components that require authenticated access.
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
