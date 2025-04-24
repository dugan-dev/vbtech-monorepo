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

import { PayerPyConfigSheet } from "./payer-py-config-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  perfYear: string;
  payerPubId: string;
};

/**
 * Renders a card UI indicating that no configuration exists for the given performance year, with an option for authorized users to access the configuration sheet.
 *
 * @param payerPubId - The public identifier of the payer to be passed to the configuration sheet.
 * @param perfYear - The performance year to display in the card header.
 *
 * @returns A JSX element displaying the no-configuration notice and, for allowed user types, a configuration sheet.
 */
export async function NoPayerConfigView({ payerPubId, perfYear }: props) {
  return (
    <Card className="w-full max-w-md">
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
          <PayerPyConfigSheet payerPubId={payerPubId} />
        </RestrictByUserAppAttrsClient>
      </CardFooter>
    </Card>
  );
}
