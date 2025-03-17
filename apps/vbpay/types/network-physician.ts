import { getAllNetworkPhysicians } from "@/repos/network-physician-repository";

export type NetworkPhysician = NonNullable<
  Awaited<ReturnType<typeof getAllNetworkPhysicians>>
>[0];
