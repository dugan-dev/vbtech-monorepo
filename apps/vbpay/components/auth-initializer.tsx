"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";

import { authConfig } from "@/lib/auth/config";

export function AuthInitializer() {
  useEffect(() => {
    Amplify.configure({ Auth: authConfig }, { ssr: true });
  }, []);

  return null;
}
