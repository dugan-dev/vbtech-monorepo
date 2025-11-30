import { getUmCaseHistory } from "@/repos/um-case-repository";

export type UmCaseHistory = NonNullable<
  Awaited<ReturnType<typeof getUmCaseHistory>>
>[0];
