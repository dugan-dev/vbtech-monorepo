import { Suspense } from "react";
import { WorklistContextProvider } from "@/contexts/worklist-context";
import { getAllHealthPlans } from "@/repos/health-plan-repository";
import {
  getAllUmCases,
  getAllUmCasesForUser,
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

import { umCase } from "@/types/um-case";
import { getClientsForTable } from "@/app/(authed)/admin/clients/repos/get-payers-for-table";
import { getAllUsers } from "@/app/(authed)/admin/users/repos/user-management-repository";

import { NewCaseSheet } from "./new-case-sheet";
import { WorklistContent } from "./worklist-content";
import { WorklistFilters } from "./worklist-filter";
import { WorklistSkeleton } from "./worklist-skeleton";

export default async function WorkList() {
  //get user details
  const user = await authenticatedUser();
  const [userData, clients, plans, users] = await Promise.all([
    getUsersData({ userId: user!.userId }),
    getClientsForTable(),
    getAllHealthPlans(),
    getAllUsers(),
  ]);

  let cases: umCase[] = [];

  if (userData.usersAppAttrs?.type === "nurse") {
    cases = await getAllUmCasesForUser(user!.userId);
  } else {
    cases = await getAllUmCases();
  }

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
      (c) => c.updatedAt.toLocaleString() === new Date().toLocaleString(),
    ).length,
  };

  return (
    <WorklistContextProvider
      cases={cases}
      clients={clients.map((client) => ({
        label: client.clientName,
        value: client.pubId,
      }))}
      healthPlans={plans}
      nurses={users.filter((user) => user.appAttrs?.type === "nurse")}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Worklist</CardTitle>
                <CardDescription>
                  Review and manage your assigned cases
                </CardDescription>
              </div>
              <NewCaseSheet>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Case
                </Button>
              </NewCaseSheet>
            </div>

            <div className="mt-4">
              <WorklistFilters />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<WorklistSkeleton />}>
              <WorklistContent
                openCases={openCases}
                closedCases={closedCases}
              />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </WorklistContextProvider>
  );
}
