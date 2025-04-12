import { getUsersData } from "@/repos/user-repository";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
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

import { SetupSheet } from "./setup-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

type props = {
  userId: string;
};

/**
 * Renders the view indicating that the VBPay license is not configured.
 *
 * This asynchronous function fetches user data using the provided user ID to determine whether the user is an admin of type "bpo". Based on these attributes, it displays an alert with instructions to either configure the license via a setup sheet or contact an administrator. The setup interface is conditionally wrapped to restrict access according to allowed user types.
 *
 * @param userId - The identifier for the user whose license configuration status is being checked.
 *
 * @returns A JSX element representing the license configuration prompt.
 */
export async function NotSetupView({ userId }: props) {
  const userData = await getUsersData({ userId });

  // If the user is of type bpo and an admin, they can configure the license.
  const canConfigure =
    userData.usersAppAttrs.admin && userData.usersAppAttrs.type === "bpo";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          License Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Icons.alertCircle className="h-4 w-4" />
          <AlertTitle>No License Configured</AlertTitle>
          <AlertDescription>
            {canConfigure ? (
              <span>
                The license for this instance of VBPay is not configured. Please
                click the button below to configure the license.
              </span>
            ) : (
              <span>
                The license for this instance of VBPay is not configured. Please
                contact your administrator.
              </span>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
      <RestrictByUserAppAttrsClient
        usersAppAttrs={userData.usersAppAttrs}
        allowedUserTypes={ALLOWED_USER_TYPES}
        adminOnly
      >
        <CardFooter className="flex justify-center">
          <SetupSheet />
        </CardFooter>
      </RestrictByUserAppAttrsClient>
    </Card>
  );
}
