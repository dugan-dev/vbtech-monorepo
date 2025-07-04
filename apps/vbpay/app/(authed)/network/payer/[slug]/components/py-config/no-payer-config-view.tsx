import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { UserType } from "@/types/user-type";
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { PayerPyConfigSheet } from "./payer-py-config-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo", "payers", "payer"];

type props = {
  perfYear: string;
  payerPubId: string;
};

/**
 * Renders a card notifying users that no configuration exists for a given performance year, with an option to add configuration for authorized user types.
 *
 * @param payerPubId - The public identifier of the payer for which configuration may be added.
 * @param perfYear - The performance year being referenced.
 * @returns A JSX element displaying the notification and, for allowed users, a configuration sheet.
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
          <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
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
