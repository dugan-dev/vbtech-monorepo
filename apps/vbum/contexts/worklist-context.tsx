"use client";

import { createContext, useContext } from "react";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { HealthPlan } from "@/types/health-plan";
import { umCase } from "@/types/um-case";
import { UserCognito } from "@/types/user-cognito";

type WorklistContextType = {
  clients: ComboItem[];
  healthPlans: HealthPlan[];
  cases: umCase[];
  nurses: UserCognito[];
};

const WorklistContext = createContext<WorklistContextType | null>(null);

export function useWorklistContext() {
  const context = useContext(WorklistContext);
  if (!context) {
    throw new Error(
      "useWorklistContext must be used within a WorklistContextProvider",
    );
  }
  return context;
}

type props = {
  clients: ComboItem[];
  healthPlans: HealthPlan[];
  cases: umCase[];
  nurses: UserCognito[];
  children: React.ReactNode;
};

export function WorklistContextProvider({
  clients,
  healthPlans,
  cases,
  nurses,
  children,
}: props) {
  return (
    <WorklistContext.Provider value={{ clients, healthPlans, cases, nurses }}>
      {children}
    </WorklistContext.Provider>
  );
}
