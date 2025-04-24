"use client";

import { createContext, useContext } from "react";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UsersData } from "@/types/users-data";

const UserContext = createContext<UsersData | null>(null);

/**
 * Returns the current user data from the nearest UserProvider context.
 *
 * @returns The {@link UsersData} supplied by the closest UserProvider.
 *
 * @throws {Error} If invoked outside of a UserProvider.
 */
export function useUserContext(): UsersData {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

type props = {
  usersData: UsersData;
  children: React.ReactNode;
};

/**
 * Provides user data to all descendant components using React context.
 *
 * Wraps the given {@link children} with a {@link UserContext.Provider}, making {@link usersData} available to any nested component that consumes the context.
 */
export function UserProvider({ usersData, children }: props) {
  return (
    <UserContext.Provider value={usersData}>{children}</UserContext.Provider>
  );
}
