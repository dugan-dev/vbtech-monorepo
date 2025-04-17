import { NetworkPhysician } from "@/types/network-physician";

import { EditPhysAffiliatesFormData } from "../components/affiliates/edit-affiliates-form/edit-phys-affiliates-schema";

export function formatEditPhysAffiliatesFormData(
  physician: NetworkPhysician,
): EditPhysAffiliatesFormData {
  const noAffiliates =
    !physician.poNetEntPubId &&
    !physician.faclNetEntPubId &&
    !physician.pracNetEntPubId &&
    !physician.vendorNetEntPubId;
  return {
    poNetEntPubId: physician.poNetEntPubId || "",
    faclNetEntPubId: physician.faclNetEntPubId || "",
    pracNetEntPubId: physician.pracNetEntPubId || "",
    vendorNetEntPubId: physician.vendorNetEntPubId || "",
    noAffiliates,
  };
}
