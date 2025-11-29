"use client";

import { createContext, useContext, useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { HealthPlan } from "@/types/health-plan";
import { Physician } from "@/types/physician";
import { umCase } from "@/types/um-case";
import { UmCaseHistory } from "@/types/um-case-history";
import { UserCognito } from "@/types/user-cognito";

type WorklistContextType = {
  clients: ComboItem[];
  healthPlans: HealthPlan[];
  cases: umCase[];
  openCases: umCase[];
  closedCases: umCase[];
  nurses: UserCognito[];
  users: UserCognito[];
  physicians: Physician[];
  caseHistory: UmCaseHistory[] | null;
  selectedCase: umCase | null;
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
  users: UserCognito[];
  physicians: Physician[];
  caseHistory: UmCaseHistory[] | null;
  children: React.ReactNode;
};

export function WorklistContextProvider({
  clients,
  healthPlans,
  cases,
  nurses,
  users,
  physicians,
  caseHistory,
  children,
}: props) {
  // Get selectedCaseId from URL
  const [selectedCaseId] = useQueryState("caseId", parseAsString);

  // Derive openCases and closedCases from cases
  const openCases = useMemo(
    () =>
      cases.filter(
        (c) =>
          c.status !== "Approved" &&
          c.status !== "Denied" &&
          c.status !== "Withdrawn",
      ),
    [cases],
  );

  const closedCases = useMemo(
    () =>
      cases.filter(
        (c) =>
          c.status === "Approved" ||
          c.status === "Denied" ||
          c.status === "Withdrawn",
      ),
    [cases],
  );

  // Derive selectedCase from URL caseId param
  const selectedCase = useMemo(
    () =>
      selectedCaseId
        ? cases.find((c) => c.pubId === selectedCaseId) || null
        : null,
    [selectedCaseId, cases],
  );

  return (
    <WorklistContext.Provider
      value={{
        clients,
        healthPlans,
        cases,
        openCases,
        closedCases,
        nurses,
        users,
        physicians,
        caseHistory,
        selectedCase,
      }}
    >
      {children}
    </WorklistContext.Provider>
  );
}
