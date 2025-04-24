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
 * Renders a card view alerting that no configuration exists for a specified performance year.
 *
 * This asynchronous component fetches user data using the provided userId to access user attributes for permission control.
 * It displays a card with a header that shows the performance year, a content section with a calendar icon and notice message,
 * and a footer that conditionally renders a configuration sheet for allowed user types.
 *
 * @param userId - Identifier for the user whose data is fetched.
 * @param payerPubId - Public identifier for the payer, which is passed to the configuration sheet.
 * @param perfYear - The performance year displayed in the card header.
 *
 * @returns A JSX element representing the card view.
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
