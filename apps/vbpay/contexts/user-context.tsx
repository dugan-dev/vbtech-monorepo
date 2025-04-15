"use client";

import { createContext, useContext } from "react";

import { UserAppAttrs } from "@/types/user-app-attrs";

const UserContext = createContext<UserAppAttrs | null>(null);

/**
 * Retrieves the current user application attributes from the context.
 *
 * @returns The current {@link UserAppAttrs} provided by the nearest {@link UserProvider}.
 *
 * @throws {Error} If called outside of a {@link UserProvider}.
 */
export function useUserContext(): UserAppAttrs {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

type UserProviderProps = {
  usersAppAttrs: UserAppAttrs;
  children: React.ReactNode;
};

/**
 * Provides the user application attributes context to descendant components.
 *
 * Wraps its children with a {@link UserContext.Provider}, making {@link usersAppAttrs} available to all nested components via the context.
 *
 * @param usersAppAttrs - The user application attributes to supply to the context.
 * @param children - The React nodes that will have access to the user context.
 */
export function UserProvider({ usersAppAttrs, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={usersAppAttrs}>
      {children}
    </UserContext.Provider>
  );
}
