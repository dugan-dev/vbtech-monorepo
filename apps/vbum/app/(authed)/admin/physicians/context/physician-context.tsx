"use client";

import { createContext, useContext } from "react";

import { ComboItem } from "@workspace/ui/types/combo-item";

type PhysicianContextType = {
  clients: ComboItem[];
};

const PhysicianContext = createContext<PhysicianContextType | null>(null);

export function usePhysicianContext() {
  const context = useContext(PhysicianContext);
  if (!context) {
    throw new Error(
      "usePhysicianContext must be used within a WorlistContextProvider",
    );
  }
  return context;
}

type props = {
  clients: ComboItem[];
  children: React.ReactNode;
};

export function PhysicianContextProvider({ clients, children }: props) {
  return (
    <PhysicianContext.Provider value={{ clients }}>
      {children}
    </PhysicianContext.Provider>
  );
}
