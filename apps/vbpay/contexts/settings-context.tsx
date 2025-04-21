"use client";

import { createContext, useContext } from "react";
import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

const SettingsContext = createContext<VBPayGlobalSettings | null>(null);

/**
 * Retrieves the current global settings from the SettingsContext.
 *
 * @returns The current {@link VBPayGlobalSettings} object from context.
 *
 * @throws {Error} If called outside of a {@link SettingsProvider}.
 */
export function useSettingsContext(): VBPayGlobalSettings {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsContextProvider",
    );
  }
  return context;
}

type props = {
  settings: VBPayGlobalSettings;
  children: React.ReactNode;
};

/**
 * Provides the global settings context to descendant React components.
 *
 * Wraps its children with a context provider, making the specified {@link settings} available throughout the component tree.
 *
 * @param settings - The global settings object to provide.
 * @param children - The React nodes that will have access to the settings context.
 */
export function SettingsProvider({ settings, children }: props) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
