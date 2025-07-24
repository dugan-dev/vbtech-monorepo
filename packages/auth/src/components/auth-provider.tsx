"use client";

import type { ReactNode } from "react";

import { AuthInitializer } from "./auth-initializer";

type props = {
  children: ReactNode;
};

/**
 * Authentication provider component that initializes AWS Amplify and wraps the application.
 *
 * @param children - The child components to render within the auth provider
 */
export function AuthProvider({ children }: props) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
