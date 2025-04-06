import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { SettingsCardClient } from "./settings-card.client";

type props = {
  userId: string;
};

export async function SettingsCardServer({ userId }: props) {
  const [license, settings, user] = await Promise.all([
    getVBPayLicense(),
    getVBPayGlobalSettings(),
    getUsersData({ userId }),
  ]);

  if (!license || !settings) {
    // Handle the case where data is missing
    throw new Error("Failed to load license or settings data");
    // Or return a meaningful fallback state
  }
  
  const formData = formatSettingsFormData(license, settings);

  return (
    <SettingsCardClient data={formData} usersAppAttrs={user.usersAppAttrs} />
  );
}
