import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getPayerByPubId } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";

import { ComboItem } from "@workspace/ui/types/combo-item";

import { PayerType, PayerTypeLabels } from "@/types/payer-type";

import { formatEditPayerFormData } from "../../utils/format-edit-payer-form-data";
import { PayerInfoCardClient } from "./payer-info-card.client";

type props = {
  userId: string;
  payerPubId: string;
};

export async function PayerInfoCardServer({ userId, payerPubId }: props) {
  const [payer, user, settings] = await Promise.all([
    getPayerByPubId({ pubId: payerPubId }),
    getUsersData({ userId }),
    getVBPayGlobalSettings(),
  ]);

  const formData = formatEditPayerFormData(payer!);

  const payerTypes: ComboItem[] = settings!.allowedPayerTypes
    .split(",")
    .map((type) => ({
      value: type,
      label: PayerTypeLabels[type as PayerType],
    }));

  return (
    <div className="w-1/4">
      <PayerInfoCardClient
        data={formData}
        usersAppAttrs={user.usersAppAttrs}
        payerTypes={payerTypes}
      />
    </div>
  );
}
