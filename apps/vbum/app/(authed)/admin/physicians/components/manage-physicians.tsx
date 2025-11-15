import "server-only";

import { getAllClients } from "@/repos/clients-repository";

import { PhysicianContextProvider } from "../context/physician-context";
import { getPhysiciansForTable } from "../repos/get-physicians-for-table";
import { ManagePhysiciansTable } from "./manage-physicians-table/manage-physicians-table";

export async function ManagePhysicians() {
  const [physicians, clients] = await Promise.all([
    getPhysiciansForTable(),
    getAllClients(),
  ]);

  const clientItems = clients.map((client) => ({
    label: client.clientName,
    value: client.pubId,
  }));

  return (
    <div className="mb-4 flex flex-1 flex-col gap-4">
      <PhysicianContextProvider clients={clientItems}>
        <ManagePhysiciansTable physicians={physicians} />
      </PhysicianContextProvider>
    </div>
  );
}
