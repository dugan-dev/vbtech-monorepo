"use client";

import { createContext, useContext } from "react";
import { VBPayLicense } from "@/repos/license-repository";

const LicenseContext = createContext<VBPayLicense | null>(null);

/**
 * Retrieves the current {@link VBPayLicense} from the React context.
 *
 * @returns The active {@link VBPayLicense} instance from context.
 *
 * @throws {Error} If called outside of a {@link LicenseProvider}.
 */
export function useLicenseContext(): VBPayLicense {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error(
      "useLicenseContext must be used within a LicenseContextProvider",
    );
  }
  return context;
}

type props = {
  license: VBPayLicense;
  children: React.ReactNode;
};

/**
 * Provides a {@link VBPayLicense} instance to descendant components via React context.
 *
 * Wraps child components and supplies the given {@link license} to the context, enabling access through the {@link useLicenseContext} hook.
 *
 * @param license - The {@link VBPayLicense} instance to provide.
 * @param children - React nodes that will have access to the license context.
 */
export function LicenseProvider({ license, children }: props) {
  return (
    <LicenseContext.Provider value={license}>
      {children}
    </LicenseContext.Provider>
  );
}
