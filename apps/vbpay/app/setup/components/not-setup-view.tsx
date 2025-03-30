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

import { Icons } from "@/components/icons";

import { SetupSheet } from "./setup-sheet";

type props = {
  userId: string;
};

export async function NotSetupView({ userId }: props) {
  const usersAppAttrs = await getUsersData({ userId });

  // If the user is of type bpo and an admin, they can configure the license.
  const canConfigure =
    usersAppAttrs.usersAppAttrs.admin &&
    usersAppAttrs.usersAppAttrs.type === "bpo";

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
      {canConfigure && (
        <CardFooter className="flex justify-center">
          <SetupSheet />
        </CardFooter>
      )}
    </Card>
  );
}
