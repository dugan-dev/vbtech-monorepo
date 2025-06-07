import "server-only";

import { db } from "@workspace/db/database";

import { AddNetworkPhysicianFormOutput } from "../components/add-network-physician-form/add-network-physician-form-schema";

type props = {
  pubId: string;
  payerPubId: string;
  userId: string;
  formData: AddNetworkPhysicianFormOutput;
};

/**
 * Inserts a new network physician record into the database, ensuring no duplicate NPI exists for the specified payer.
 *
 * @param pubId - The public identifier for the new physician record.
 * @param payerPubId - The public identifier of the payer.
 * @param userId - The identifier of the user performing the insertion.
 * @param formData - The form data containing physician and affiliation information.
 * @returns An object indicating successful insertion: `{ success: true }`.
 *
 * @throws {Error} If a physician with the same NPI already exists for the given payer.
 */
export async function insertPhysician({
  pubId,
  payerPubId,
  userId,
  formData,
}: props) {
  return await db.transaction().execute(async (trx) => {
    // Check for duplicate NPI
    const existingPhysician = await trx
      .selectFrom("networkPhysician")
      .where("npi", "=", formData.physInfo.npi)
      .where("payerPubId", "=", payerPubId)
      .select("pubId")
      .executeTakeFirst();

    if (existingPhysician) {
      throw new Error(
        "A Network Physician with this NPI already exists for this Payer.",
      );
    }

    const now = new Date();

    await trx
      .insertInto("networkPhysician")
      .values({
        pubId,
        payerPubId,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        updatedBy: userId,
        taxId: formData.physInfo.taxId,
        npi: formData.physInfo.npi,
        orgNpi: formData.physInfo.orgNpi,
        firstName: formData.physInfo.firstName,
        lastName: formData.physInfo.lastName,
        type: formData.physInfo.type,
        class: formData.physInfo.class,
        soleProprietor: formData.physInfo.soleProprietor === "yes" ? 1 : 0,
        primaryTaxonomyCode: formData.physInfo.primaryTaxonomyCode,
        specialty: formData.physInfo.specialty,
        credential: formData.physInfo.credential,
        isActive: 1,
        poNetEntPubId: formData.affInfo.poNetEntPubId,
        faclNetEntPubId: formData.affInfo.faclNetEntPubId,
        pracNetEntPubId: formData.affInfo.pracNetEntPubId,
        vendorNetEntPubId: formData.affInfo.vendorNetEntPubId,
      })
      .execute();

    return { success: true };
  });
}
