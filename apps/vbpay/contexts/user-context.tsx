"use client";

import { createContext, useContext } from "react";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UsersData } from "@/types/users-data";

const UserContext = createContext<UsersData | null>(null);

/**
 * Retrieves the current user data from the nearest UserProvider context.
 *
 * @returns The current {@link UsersData} provided by the nearest UserProvider.
 *
 * @throws {Error} If called outside of a UserProvider.
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
 * Supplies user data to descendant components via React context.
 *
 * Wraps children with {@link UserContext.Provider}, making {@link usersData} accessible to all nested components.
 *
 * @param usersData - The user data to provide through context.
 * @param children - React nodes that will receive the context value.
 */
export function UserProvider({ usersData, children }: props) {
  return (
    <UserContext.Provider value={usersData}>{children}</UserContext.Provider>
  );
}
