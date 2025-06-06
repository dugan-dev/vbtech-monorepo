import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { LicenseCardClient } from "./license-card.client";

/**
 * Retrieves license and global settings data, formats them, and renders the LicenseCardClient component.
 *
 * @returns A React element displaying the formatted license and settings information.
 *
 * @throws {Error} If license or settings data is missing.
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
