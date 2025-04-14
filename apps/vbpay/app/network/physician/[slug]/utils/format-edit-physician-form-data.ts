import { NetworkPhysician } from "@/types/network-physician";

import { EditPhysicianFormData } from "../components/info/edit-physician-form/edit-physician-form-schema";

/**
 * Converts a {@link NetworkPhysician} object into an {@link EditPhysicianFormData} structure for form usage.
 *
 * Optional fields are defaulted to empty strings if missing, and the {@link NetworkPhysician.soleProprietor} numeric value is mapped to a string ("yes" or "no").
 *
 * @param physician - The physician data to format.
 * @returns The formatted form data object.
 */
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
