import { Payer } from "@/types/payer";

import { EditPayerFormData } from "../components/info/edit-payer-form/edit-payer-form-schema";

/**
 * Formats a Payer object into an EditPayerFormData structure.
 *
 * This function maps properties from the given payer, converting numeric performance year and month
 * fields to strings and ensuring that optional fields default to an empty string if not provided.
 *
 * @param payer - The payer object containing properties to be formatted.
 * @returns A formatted EditPayerFormData object.
 */
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
