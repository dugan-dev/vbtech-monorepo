import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { HomePage } from "@/routes";
import { SignInOutput } from "aws-amplify/auth";

export function handleSignInNextStep(
  output: SignInOutput,
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  handleError: (message: string) => void,
  router: AppRouterInstance,
  redirectUrl: string | null,
) {
  switch (output.nextStep.signInStep) {
    case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
    case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
    case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
      setCurrentState(output);
      setIsLoading(false);
      break;
    case "DONE":
      router.push(redirectUrl || HomePage({}));
      setIsLoading(false);
      break;
    default:
      handleError(
        `Unhandled sign in next step: ${output?.nextStep.signInStep}. Please contact support.`,
      );
      setIsLoading(false);
      break;
  }
}
