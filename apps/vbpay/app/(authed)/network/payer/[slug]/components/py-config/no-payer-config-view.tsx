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
 * Displays a card indicating that no configuration exists for the specified performance year.
 *
 * Shows the performance year in the header, a calendar icon with a notice message in the content, and conditionally renders a configuration sheet for allowed user types in the footer.
 *
 * @param payerPubId - Public identifier for the payer, passed to the configuration sheet.
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
