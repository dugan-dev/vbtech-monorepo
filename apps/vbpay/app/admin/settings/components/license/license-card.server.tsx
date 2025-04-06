import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { LicenseCardClient } from "./license-card.client";

type props = {
  userId: string;
};

/**
 * Retrieves license, settings, and user data concurrently using the provided user ID, formats the fetched data,
 * and returns a LicenseCardClient component with the formatted data and user attributes.
 *
 * This asynchronous server-side function performs parallel API calls to obtain the necessary license information,
 * global settings, and user data. It then formats the license and settings data via the formatSettingsFormData utility
 * and renders the LicenseCardClient component.
 *
 * @param userId - The unique identifier for the user whose data is fetched.
 *
 * @returns A JSX element representing the license card for the user.
 */
export async function LicenseCardServer({ userId }: props) {
  const [license, settings, user] = await Promise.all([
    getVBPayLicense(),
    getVBPayGlobalSettings(),
    getUsersData({ userId }),
  ]);

  const formData = formatSettingsFormData(license!, settings!);

  return (
    <LicenseCardClient data={formData} usersAppAttrs={user.usersAppAttrs} />
  );
}
