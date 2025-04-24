"use client";

import { useUserContext } from "@/contexts/user-context";

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

/**
 * Displays a prompt indicating that the VBPay license is not configured, with instructions based on the user's permissions.
 *
 * Shows an alert and, if the user is an admin of type "bpo", provides access to the license setup interface.
 *
 * @returns A JSX element prompting the user to configure the VBPay license or contact an administrator.
 */
export function NotSetupView() {
  const userData = useUserContext();
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
