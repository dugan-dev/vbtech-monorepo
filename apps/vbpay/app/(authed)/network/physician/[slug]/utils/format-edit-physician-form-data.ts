import { NetworkPhysician } from "@/types/network-physician";

import { EditPhysicianFormData } from "../components/info/edit-physician-form/edit-physician-form-schema";

export function formatEditPhysicianFormData(
  physician: NetworkPhysician,
): EditPhysicianFormData {
  return {
    taxId: physician.taxId || "",
    npi: physician.npi || "",
    orgNpi: physician.orgNpi || "",
    firstName: physician.firstName,
    lastName: physician.lastName,
    type: physician.type,
    class: physician.class,
    soleProprietor: physician.soleProprietor === 1 ? "yes" : "no",
    primaryTaxonomyCode: physician.primaryTaxonomyCode || "",
    specialty: physician.specialty || "",
    credential: physician.credential || "",
  };
}
