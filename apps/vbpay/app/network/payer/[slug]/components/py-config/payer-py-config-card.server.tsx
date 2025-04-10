import { getPayerByPubId } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";

import { PayerType } from "@/types/payer-type";

import { getPayerPyConfig } from "../../repos/payer-py-config-repository";
import { formatPayerPyConfigFormData } from "../../utils/format-payer-py-config-form-data";
import { NoPayerConfigView } from "./no-payer-config-view";
import { PayerPyConfigCardClient } from "./payer-py-config-card.client";
import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { PayerPyConfigUnsupportedPayerType } from "./payer-py-config-unsupported-payer-type";

type props = {
  userId: string;
  payerPubId: string;
  perfYearUrl?: string;
};

export async function PayerPyConfigCardServer({
  userId,
  payerPubId,
  perfYearUrl,
}: props) {
  const perfYear = perfYearUrl ?? new Date().getFullYear().toString();
  const [payerPyConfig, payer, user] = await Promise.all([
    getPayerPyConfig(payerPubId, perfYear),
    getPayerByPubId({ pubId: payerPubId }),
    getUsersData({ userId }),
  ]);

  let formData: PayerPyConfigFormData | undefined = undefined;

  if ((payer?.payerType as PayerType) !== "aco") {
    return <PayerPyConfigUnsupportedPayerType perfYear={perfYear} />;
  }

  if (payerPyConfig) {
    formData = formatPayerPyConfigFormData(payerPyConfig);
  } else {
    return (
      <NoPayerConfigView
        userId={userId}
        perfYear={perfYear}
        payerPubId={payerPubId}
      />
    );
  }

  return (
    <div className="w-1/3">
      <PayerPyConfigCardClient
        perfYear={perfYear}
        data={formData}
        payerPubId={payerPubId}
        pubId={payerPyConfig?.pubId}
        usersAppAttrs={user.usersAppAttrs}
      />
    </div>
  );
}
