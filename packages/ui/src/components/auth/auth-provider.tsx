"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { signOut } from "aws-amplify/auth";

import { clearSidebarState } from "@workspace/ui/components/main-sidebar/main-sidebar-cookies";
import { useAutoLogout } from "@workspace/ui/hooks/use-auto-logout";

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
 * Configuration for the AuthProvider.
 */
export type AuthProviderConfig = {
  /** Function to get the current user from AWS Amplify */
  getCurrentUser: () => Promise<AuthUser>;
  /** Function to redirect to sign-in page */
  redirectToSignIn: () => void;
  /** App name for clearing sidebar state */
  appName: string;
  /** Auto-logout timeout in minutes */
  autoLogoutMinutes?: number;
  /** Whether to check auth on visibility change */
  checkOnVisibilityChange?: boolean;
};

/**
 * Props for the AuthProvider component.
 */
type props = {
  /** Configuration for the auth provider */
  config: AuthProviderConfig;
  /** React children to be wrapped by the auth context */
  children: React.ReactNode;
};

const AuthContext = createContext<AuthUser>(null);

/**
 * Provides authentication context to the application with session management.
 *
 * This component manages the authentication state, handles session checking,
 * redirects unauthenticated users, and provides auto-logout functionality.
 * It automatically fetches the user on mount and updates the context when
 * the user state changes.
 *
 * @param props - Configuration object containing auth config and children
 * @returns AuthProvider component that wraps children with authentication context
 */
export function AuthProvider({ config, children }: props) {
  const [user, setUser] = useState<AuthUser>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    getCurrentUser,
    redirectToSignIn,
    appName,
    autoLogoutMinutes = 10,
    checkOnVisibilityChange = true,
  } = config;

  const checkSession = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (!currentUser) {
        redirectToSignIn();
      }
    } catch {
      setUser(null);
      redirectToSignIn();
    } finally {
      setCheckingAuth(false);
    }
  }, [getCurrentUser, redirectToSignIn]);

  useEffect(() => {
    checkSession();

    if (checkOnVisibilityChange) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          checkSession();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
    }
  }, [checkSession, checkOnVisibilityChange]);

  const handleAutoLogout = useCallback(async () => {
    clearSidebarState(appName);
    await signOut();
    redirectToSignIn();
  }, [appName, redirectToSignIn]);

  useAutoLogout(handleAutoLogout, autoLogoutMinutes);

  if (checkingAuth) return null;

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
