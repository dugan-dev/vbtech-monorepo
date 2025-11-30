import "server-only";

import { Suspense } from "react";
import { WorklistContextProvider } from "@/contexts/worklist-context";
import { getAllHealthPlans } from "@/repos/health-plan-repository";
import {
  getAllUmCases,
  getAllUmCasesForUser,
  getUmCaseHistory,
} from "@/repos/um-case-repository";
import { getUsersData } from "@/repos/user-repository";
import { Plus } from "lucide-react";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { formatDate } from "@workspace/utils/format-date";

import { umCase } from "@/types/um-case";
import { getClientsForTable } from "@/app/(authed)/admin/clients/repos/get-payers-for-table";
import { getPhysiciansForTable } from "@/app/(authed)/admin/physicians/repos/get-physicians-for-table";
import { getAllUsers } from "@/app/(authed)/admin/users/repos/user-management-repository";

import { CaseSheet } from "./case-sheet";
import { WorklistContent } from "./worklist-content";
import { WorklistFilters } from "./worklist-filters";
import { WorklistSkeleton } from "./worklist-skeleton";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Checks if two dates fall on the same calendar day.
 * @param a - First date to compare
 * @param b - Second date to compare
 * @returns true if both dates are on the same year, month, and day
 */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Renders the WorkList page and supplies its children with server-fetched worklist data.
 *
 * Fetches authenticated user info, clients, health plans, users, physicians, and cases,
 * computes worklist stats for the UI, and (when a `caseId` is present in `searchParams`)
 * loads the selected case's history. Wraps the UI in a WorklistContextProvider and
 * renders the stats cards, filters, and worklist content.
 *
 * @param searchParams - Optional promise resolving to query parameters; if `caseId` is present as a string, the component fetches that case's history and sets it in context.
 * @returns The rendered worklist page JSX populated with server-side data and context for child components.
 */
export default async function WorkList({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCaseId =
    typeof params?.caseId === "string" ? params.caseId : null;
  //get user details
  const user = await authenticatedUser();
  const [userData, clients, plans, users, physicians] = await Promise.all([
    getUsersData({ userId: user!.userId }),
    getClientsForTable(),
    getAllHealthPlans(),
    getAllUsers(),
    getPhysiciansForTable(),
  ]);

  let cases: umCase[] = [];
  let isUserNurse = false;

  if (userData.usersAppAttrs?.type === "nurse") {
    isUserNurse = true;
    cases = await getAllUmCasesForUser(user!.userId);
  } else {
    cases = await getAllUmCases();
  }

  // Filter cases for stats (computed here for server-side rendering of stats cards)
  const openCases = cases.filter(
    (c) =>
      c.status !== "Approved" &&
      c.status !== "Denied" &&
      c.status !== "Withdrawn",
  );
  const closedCases = cases.filter(
    (c) =>
      c.status === "Approved" ||
      c.status === "Denied" ||
      c.status === "Withdrawn",
  );

  const stats = {
    open: openCases.length,
    underReview: openCases.filter((c) => c.status === "Under Review").length,
    escalated: openCases.filter((c) => c.mdReview === 1).length,
    closedToday: closedCases.filter(
      (c) => c.closedAt && isSameDay(new Date(c.closedAt), new Date()),
    ).length,
  };

  // Fetch case history if a case is selected
  const caseHistory = selectedCaseId
    ? await getUmCaseHistory(selectedCaseId)
    : null;

  return (
    <WorklistContextProvider
      cases={cases}
      clients={clients.map((client) => ({
        label: client.clientName,
        value: client.pubId,
      }))}
      healthPlans={plans}
      nurses={users.filter((user) => user.appAttrs?.type === "nurse")}
      users={users}
      physicians={physicians}
      caseHistory={caseHistory}
    >
      {/* Main Content */}
      <main>
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Cases</CardDescription>
              <CardTitle className="text-3xl">{stats.open}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Under Review</CardDescription>
              <CardTitle className="text-3xl">{stats.underReview}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Escalated to MD</CardDescription>
              <CardTitle className="text-3xl">{stats.escalated}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Closed Today</CardDescription>
              <CardTitle className="text-3xl">{stats.closedToday}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Worklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle>
                  {isUserNurse ? "My Worklist" : "Case List"}
                </CardTitle>
                <CardDescription>
                  {isUserNurse
                    ? "Review and manage your assigned cases."
                    : "Review and manage cases."}
                </CardDescription>
              </div>
              <div className="shrink-0">
                <CaseSheet mode="new">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Case
                  </Button>
                </CaseSheet>
              </div>
            </div>

            <div className="mt-4">
              <WorklistFilters />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<WorklistSkeleton />}>
              <WorklistContent />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </WorklistContextProvider>
  );
}
