"use client";

import { createContext, useContext } from "react";

import { UserAppAttrs } from "@/types/user-app-attrs";

const UserContext = createContext<UserAppAttrs | null>(null);

/**
 * Returns the current user application attributes from the React context.
 *
 * @returns The {@link UserAppAttrs} object provided by the nearest {@link UserProvider}.
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
 * Provides user application attributes to descendant components via React context.
 *
 * Wraps its children with a context provider, making the specified {@link usersAppAttrs} available to components that consume the user context.
 *
 * @param usersAppAttrs - The user application attributes to provide.
 * @param children - The React nodes that will have access to the user context.
 */
export function UserProvider({ usersAppAttrs, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={usersAppAttrs}>
      {children}
    </UserContext.Provider>
  );
}
