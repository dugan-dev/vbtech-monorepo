import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { SettingsCardClient } from "./settings-card.client";

/**
 * Renders the settings card client component with formatted license and global settings data.
 *
 * @returns A React element displaying the settings card with the current license and settings information.
 *
 * @throws {Error} If license or global settings data cannot be loaded.
 */
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
