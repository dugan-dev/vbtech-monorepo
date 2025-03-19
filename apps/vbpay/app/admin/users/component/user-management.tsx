import "server-only";

import { Suspense } from "react";
import { getAllNetworkEntities } from "@/repos/network-entity-repository";
import { getAllNetworkPhysicians } from "@/repos/network-physician-repository";
import { getAllPayers } from "@/repos/payer-repository";
import { formatMarketingAndRefName } from "@/utils/format-marketing-name-and-ref-name";
import { formatPhysicianNameNpi } from "@/utils/format-physician-name-and-npi";

import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";

import { NetworkEntityType } from "@/types/network-entity-type";

import { getAllUsers } from "../repos/user-management-repository";
import { UserManagementTable } from "./user-management-table/user-management-table";

export async function UserManagement() {
  // Get all the data we need
  const [/*usersType,*/ entities, payers, physicians, users] =
    await Promise.all([
      /*getUserType(),*/
      getAllNetworkEntities(),
      getAllPayers(),
      getAllNetworkPhysicians(),
      getAllUsers(),
    ]);

  /*
  if (usersType !== "bpo") {
    forbidden();
  }
  */

  // Filter the entities into the different types and map them to the format we need for the UI
  const practices = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "prac")
    .map((entity) => ({
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
      value: entity.pubId,
    }));
  const pos = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "po")
    .map((entity) => ({
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
      value: entity.pubId,
    }));
  const facilities = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "facl")
    .map((entity) => ({
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
      value: entity.pubId,
    }));
  const vendors = entities
    .filter((entity) => (entity.netEntType as NetworkEntityType) === "vendor")
    .map((entity) => ({
      label: formatMarketingAndRefName(
        entity.marketingName,
        entity.referenceName,
      ),
      value: entity.pubId,
    }));
  const payersCombo = payers.map((payer) => ({
    label: formatMarketingAndRefName(payer.marketingName, payer.referenceName),
    value: payer.pubId,
  }));
  const physiciansCombo = physicians.map((physician) => ({
    physDisplayName: formatPhysicianNameNpi(
      physician.firstName,
      physician.lastName,
      physician.npi,
    ),
    physPubId: physician.pubId,
    physType: physician.type,
  }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <UserManagementTable
          users={users}
          // TODO: Pass the usersType
          usersType={"bpo"}
          practices={practices}
          pos={pos}
          facilities={facilities}
          vendors={vendors}
          payers={payersCombo}
          physicians={physiciansCombo}
        />
      </Suspense>
    </div>
  );
}
