"use client";

import { PropsWithChildren, useEffect } from "react";
import { Amplify } from "aws-amplify";

import { authConfig } from "@/lib/auth/config";

export function AuthProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    Amplify.configure(
      {
        Auth: authConfig,
      },
      { ssr: true },
    );
  }, []);

  return <>{children}</>;
}
