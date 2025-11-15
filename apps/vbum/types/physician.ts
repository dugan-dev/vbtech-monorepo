import { getPhysiciansForTable } from "@/app/(authed)/admin/physicians/repos/get-physicians-for-table";

export type Physician = NonNullable<
  Awaited<ReturnType<typeof getPhysiciansForTable>>
>[0];
