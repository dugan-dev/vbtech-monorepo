import { getPayerByPubId } from "@/repos/payer-repository";

export type Payer = NonNullable<Awaited<ReturnType<typeof getPayerByPubId>>>;
