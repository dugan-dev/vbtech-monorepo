"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@/routes";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";

import { authConfig } from "@/lib/auth/config";
import { useAutoLogout } from "@/hooks/use-auto-logout";

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
