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
  perfYear: string;
  payerPubId: string;
};

/**
 * Renders a card notifying the user that no configuration exists for the specified performance year, and provides a configuration option for users with appropriate access.
 *
 * @param payerPubId - The public identifier of the payer, passed to the configuration dialog.
 * @param perfYear - The performance year being referenced.
 */
export function NoPhysConfigView({ payerPubId, perfYear }: props) {
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
        <RestrictByUserAppAttrsClient allowedUserTypes={ALLOWED_USER_TYPES}>
          <PhysPyConfigDialog payerPubId={payerPubId} />
        </RestrictByUserAppAttrsClient>
      </CardFooter>
    </Card>
  );
}
