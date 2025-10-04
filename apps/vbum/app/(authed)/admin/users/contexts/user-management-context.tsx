"use client";

import { createContext, useContext } from "react";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { UserCognito } from "@/types/user-cognito";

type UserManagementContextType = {
  users: UserCognito[];
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
  lastUserSync?: Date;
  children: React.ReactNode;
};

export function UserManagementContextProvider({
  clients,
  lastUserSync,
  users,
  children,
}: props) {
  return (
    <UserManagementContext.Provider value={{ clients, lastUserSync, users }}>
      {children}
    </UserManagementContext.Provider>
  );
}
