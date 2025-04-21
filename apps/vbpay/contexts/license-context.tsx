"use client";

import { createContext, useContext } from "react";
import { VBPayLicense } from "@/repos/license-repository";

const LicenseContext = createContext<VBPayLicense | null>(null);

/**
 * Retrieves the current {@link VBPayLicense} from the LicenseContext.
 *
 * @returns The current {@link VBPayLicense} provided by the nearest LicenseProvider.
 *
 * @throws {Error} If called outside of a LicenseProvider.
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
 * Provides the current {@link VBPayLicense} to descendant components via React context.
 *
 * Wraps its children with a context provider, allowing them to access the license using {@link useLicenseContext}.
 *
 * @param license - The license object to provide to the context.
 * @param children - React nodes that will have access to the license context.
 */
export function LicenseProvider({ license, children }: props) {
  return (
    <LicenseContext.Provider value={license}>
      {children}
    </LicenseContext.Provider>
  );
}
