"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";

import { authConfig } from "@/lib/auth/config";
import { useAutoLogout } from "@/hooks/use-auto-logout";

/**
 * Provides authentication context and session validation for child components.
 *
 * Ensures that only authenticated users can access its children by verifying the user session on mount and whenever the page becomes visible. Unauthenticated users are redirected to the sign-in page. While authentication is being checked, renders nothing. Also enables automatic logout after a period of inactivity.
 *
 * @param children - The components that require authentication context.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    Amplify.configure({ Auth: authConfig }, { ssr: true });

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
  }, [router]);

  useAutoLogout(10);

  if (checkingAuth) return null;

  return <>{children}</>;
}
