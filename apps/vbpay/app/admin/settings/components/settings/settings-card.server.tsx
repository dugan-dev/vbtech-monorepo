import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { SettingsCardClient } from "./settings-card.client";

type props = {
  userId: string;
};

/**
 * Fetches license, settings, and user data concurrently and returns a configured settings card component.
 *
 * This function concurrently retrieves the VBPay license, global settings, and user data by using Promise.all.
 * After formatting the fetched license and settings data with the formatting utility, it renders the SettingsCardClient component
 * with the formatted data and the user's application attributes.
 *
 * @param userId - A unique identifier for the user whose data is retrieved.
 *
 * @returns A JSX element representing the configured settings card.
 */
export async function SettingsCardServer({ userId }: props) {
  const [license, settings, user] = await Promise.all([
    getVBPayLicense(),
    getVBPayGlobalSettings(),
    getUsersData({ userId }),
  ]);

  const formData = formatSettingsFormData(license!, settings!);

  return (
    <SettingsCardClient data={formData} usersAppAttrs={user.usersAppAttrs} />
  );
}
