import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatSettingsFormData } from "../../utils/format-vbpay-license-and-setting";
import { LicenseCardClient } from "./license-card.client";

type props = {
  userId: string;
};

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
