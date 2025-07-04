"use client";

import { useUserContext } from "@/contexts/user-context";
import { AlertCircle } from "lucide-react";

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
import RestrictByUserAppAttrsClient from "@/components/restrict-by-user-app-attrs-client";

import { SetupSheet } from "./setup-sheet";

const ALLOWED_USER_TYPES: UserType[] = ["bpo"];

/**
 * Renders a prompt informing the user that the VBPay license is not configured, displaying setup instructions or contact guidance based on user permissions.
 *
 * If the user is an admin of type "bpo", provides access to the license setup interface; otherwise, instructs the user to contact an administrator.
 *
 * @returns A JSX element with a license configuration prompt and, if permitted, the setup interface.
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
          <AlertCircle className="h-4 w-4" />
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
