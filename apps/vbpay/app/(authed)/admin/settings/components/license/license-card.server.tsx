import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { LicenseCardClient } from "./license-card.client";

/**
 * Renders the LicenseCardClient component with formatted license and global settings data.
 *
 * Fetches license and global settings concurrently, formats the combined data, and returns a React element displaying the information.
 *
 * @returns A React element containing the formatted license and settings data.
 *
 * @throws {Error} If license or settings data cannot be retrieved.
 */
export async function LicenseCardServer() {
  const [license, settings] = await Promise.all([
    getVBPayLicense(),
    getVBPayGlobalSettings(),
  ]);

  if (!license || !settings) {
    throw new Error("License or settings data not found");
  }
  const formData = formatSettingsFormData(license, settings);

  return <LicenseCardClient data={formData} />;
}
