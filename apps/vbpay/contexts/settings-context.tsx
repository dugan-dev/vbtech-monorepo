"use client";

import { createContext, useContext } from "react";
import { VBPayGlobalSettings } from "@/repos/global-settings-repository";

const SettingsContext = createContext<VBPayGlobalSettings | null>(null);

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

export function SettingsProvider({ settings, children }: props) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
