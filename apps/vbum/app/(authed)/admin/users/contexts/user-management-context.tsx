"use client";

import { createContext, useContext } from "react";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { UserCognito } from "@/types/user-cognito";

type UserManagementContextType = {
  users: UserCognito[];
  userTypes: ComboItem[];
  clients: ComboItem[];
  lastUserSync?: Date;
};

const UserManagementContext = createContext<UserManagementContextType | null>(
  null,
);

export function useUserManagementContext() {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error(
      "useUserManagementContext must be used within a UserManagementContextProvider",
    );
  }
  return context;
}

type props = {
  users: UserCognito[];
  clients: ComboItem[];
  userTypes: ComboItem[];
  lastUserSync?: Date;
  children: React.ReactNode;
};

/**
 * Provides UserManagementContext to descendant components.
 *
 * @param clients - Available clients represented as combo items for use in UI controls.
 * @param userTypes - Available user type options represented as combo items.
 * @param lastUserSync - Optional timestamp of the last user synchronization.
 * @param users - Array of users in the Cognito-backed user store.
 * @param children - React nodes that will receive the context value.
 * @returns A React element that supplies the UserManagementContext value to its children.
 */
export function UserManagementContextProvider({
  clients,
  userTypes,
  lastUserSync,
  users,
  children,
}: props) {
  return (
    <UserManagementContext.Provider
      value={{ clients, lastUserSync, users, userTypes }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}