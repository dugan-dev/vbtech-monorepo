import { getPayerPyConfig } from "../repos/payer-py-config-repository";

export type PayerPyConfig = NonNullable<
  Awaited<ReturnType<typeof getPayerPyConfig>>
>;
