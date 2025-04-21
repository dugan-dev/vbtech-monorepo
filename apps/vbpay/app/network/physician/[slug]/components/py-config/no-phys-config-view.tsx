import { getUsersData } from "@/repos/user-repository";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { UserType } from "@/types/user-type";
import { Icons } from "@/components/icons";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { PhysPyConfigDialog } from "./phys-py-config-dialog";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  userId: string;
  perfYear: string;
  payerPubId: string;
};

/**
 * Renders a card indicating that no configuration exists for the specified performance year, with an option to configure if the user has appropriate access.
 *
 * Displays the performance year and a message about the absence of configuration. If the user belongs to an allowed type, a configuration dialog is made available.
 *
 * @param userId - The unique identifier of the user whose attributes are checked for access.
 * @param payerPubId - The public identifier of the payer, passed to the configuration dialog.
 * @param perfYear - The performance year for which configuration status is shown.
 */
export async function NoPhysConfigView({
  userId,
  payerPubId,
  perfYear,
}: props) {
  const userData = await getUsersData({ userId });

  return (
    <Card className="min-w-[300px] w-1/4 max-w-[33.333%] hover:transform hover:scale-105 transition duration-300">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Performance Year {perfYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Icons.calendar className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No configuration exists for this performance year
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <RestrictByUserAppAttrsClient
          usersAppAttrs={userData.usersAppAttrs}
          allowedUserTypes={ALLOWED_USER_TYPES}
        >
          <PhysPyConfigDialog payerPubId={payerPubId} />
        </RestrictByUserAppAttrsClient>
      </CardFooter>
    </Card>
  );
}
