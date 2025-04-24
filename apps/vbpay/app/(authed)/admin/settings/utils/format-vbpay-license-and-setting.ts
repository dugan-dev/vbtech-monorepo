import { VBPayGlobalSettings } from "@/repos/global-settings-repository";
import { VBPayLicense } from "@/repos/license-repository";

import { LicenseFunctionality } from "@/types/license-functionality";
import { PayerType } from "@/types/payer-type";
import { PaymentTypeType } from "@/types/payment-type";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

export function formatSettingsFormData(
  license: VBPayLicense,
  settings: VBPayGlobalSettings,
): SetupFormData {
  return {
    licenseInfo: {
      type: license.type as "BPaaS" | "SaaS",
      clientName: license.clientName,
      pocName: license.pocName,
      pocPhone: license.pocPhone,
      pocEmail: license.pocEmail,
      numPayers: String(license.numPayers),
      fromDate: license.fromDate
        ? (new Date(license.fromDate).toISOString().split("T")[0] ?? "")
        : "",
      toDate: license.toDate
        ? (new Date(license.toDate).toISOString().split("T")[0] ?? "")
        : "",
    },
    functionality: {
      paymentTypes: license.paymentTypes.split(",").map((type) => {
        return type as PaymentTypeType;
      }),
      functionality: license.functionality.split(",").map((type) => {
        return type as LicenseFunctionality;
      }),
    },
    globalSettings: {
      payerReqTaxId: settings.payerReqTaxId === 1,
      poReqTaxId: settings.poReqTaxId === 1,
      poReqNpi: settings.poReqNpi === 1,
      pracReqNpi: settings.pracReqNpi === 1,
      pracReqTaxId: settings.pracReqTaxId === 1,
      physReqTaxId: settings.physReqTaxId === 1,
      physReqCred: settings.physReqCred === 1,
      physReqSpec: settings.physReqSpec === 1,
      physNppesRecon: settings.physNppesRecon === 1,
      faclReqNpi: settings.faclReqNpi === 1,
      faclReqTaxId: settings.faclReqTaxId === 1,
      allowedPayerTypes: (typeof settings.allowedPayerTypes === "string"
        ? (settings.allowedPayerTypes as string).split(",").filter(Boolean)
        : []) as PayerType[],
    },
  };
}
