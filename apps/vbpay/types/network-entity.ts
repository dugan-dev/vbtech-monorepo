import { getAllNetworkEntities } from "@/repos/network-entity-repository";

export type NetworkEntity = NonNullable<
  Awaited<ReturnType<typeof getAllNetworkEntities>>[0]
>;
