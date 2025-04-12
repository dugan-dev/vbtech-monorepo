import { Payer } from "@/types/payer";

import { EditPayerFormData } from "../components/info/edit-payer-form/edit-payer-form-schema";

export function formatEditPayerFormData(payer: Payer): EditPayerFormData {
  return {
    payerType: payer.payerType,
    initPerfYr: payer.initPerfYr.toString(),
    initPerfMo: payer.initPerfMo.toString(),
    cmsId: payer.cmsId || "",
    marketingName: payer.marketingName,
    legalName: payer.legalName || "",
    referenceName: payer.referenceName || "",
    taxId: payer.taxId || "",
    parentOrgName: payer.parentOrgName || "",
    websiteUrl: payer.websiteUrl || "",
  };
}
