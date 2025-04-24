import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { SettingsCardClient } from "./settings-card.client";

export async function SettingsCardServer() {
  const [license, settings] = await Promise.all([
    getVBPayLicense(),
    getVBPayGlobalSettings(),
  ]);

  if (!license || !settings) {
    throw new Error("Failed to load license or settings data");
  }

  const formData = formatSettingsFormData(license, settings);

  return <SettingsCardClient data={formData} />;
}
