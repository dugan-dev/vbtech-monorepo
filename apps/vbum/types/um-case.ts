import { getAllUmCases } from "@/repos/um-case-repository";

export type umCase = NonNullable<Awaited<ReturnType<typeof getAllUmCases>>>[0];
