"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Represents an authenticated user with basic information.
 */
export type AuthUser = {
  userId: string;
  username: string;
  signInDetails: {
    loginId: string;
    authFlowType: string;
  };
} | null;

/**
 * Props for the AuthProvider component.
 */
type props = {
  /** Function to retrieve the current authenticated user */
  getUser: () => Promise<AuthUser>;
  /** React children to be wrapped by the auth context */
  children: React.ReactNode;
};

const AuthContext = createContext<AuthUser>(null);

/**
 * Provides authentication context to the application.
 *
 * This component manages the authentication state and provides it to all child components
 * through React Context. It automatically fetches the user on mount and updates the
 * context when the user state changes.
 *
 * @param props - Configuration object containing getUser function and children
 * @returns AuthProvider component that wraps children with authentication context
 */
export function AuthProvider({ getUser, children }: props) {
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, [getUser]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the current authenticated user from the auth context.
 *
 * @returns The current authenticated user or null if not authenticated
 * @throws Error if used outside of an AuthProvider
 */
export function useAuthUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthUser must be used within an AuthProvider");
  }
  return context;
}
