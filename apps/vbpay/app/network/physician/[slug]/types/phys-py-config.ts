import { getPhysPyConfig } from "../repos/phys-py-config-repository";

export type PhysPyConfig = NonNullable<
  Awaited<ReturnType<typeof getPhysPyConfig>>
>;
