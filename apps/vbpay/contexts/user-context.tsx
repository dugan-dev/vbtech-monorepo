"use client";

import { createContext, useContext } from "react";

import { UserAppAttrs } from "@/types/user-app-attrs";

const UserContext = createContext<UserAppAttrs | null>(null);

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

export function UserProvider({ usersAppAttrs, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={usersAppAttrs}>
      {children}
    </UserContext.Provider>
  );
}
