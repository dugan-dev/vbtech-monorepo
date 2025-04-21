"use client";

import { createContext, useContext } from "react";
import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

const SettingsContext = createContext<VBPayGlobalSettings | null>(null);

/**
 * Retrieves the current global settings from the SettingsContext.
 *
 * @returns The current {@link VBPayGlobalSettings} provided by the nearest SettingsProvider.
 *
 * @throws {Error} If called outside of a SettingsProvider.
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
 * Provides global settings to descendant components via React context.
 *
 * Wraps its children with a context provider that supplies the given {@link settings} object, allowing nested components to access global settings using the corresponding context hook.
 *
 * @param settings - The global settings object to provide.
 * @param children - React nodes that will have access to the provided settings.
 */
export function SettingsProvider({ settings, children }: props) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
