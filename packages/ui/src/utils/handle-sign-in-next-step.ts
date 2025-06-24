import { SignInOutput } from "aws-amplify/auth";

/**
 * Handles the next step in the sign-in process based on the authentication output.
 *
 * This function processes the sign-in result and updates the application state accordingly.
 * It handles various authentication scenarios like password changes, MFA setup, and completion.
 *
 * @param output - The sign-in output from AWS Amplify
 * @param setCurrentState - Function to update the current authentication state
 * @param setIsLoading - Function to update the loading state
 * @param handleError - Function to handle and display errors
 */
export function handleSignInNextStep(
  output: SignInOutput,
  setCurrentState: React.Dispatch<React.SetStateAction<SignInOutput | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  handleError: (message: string) => void,
) {
  switch (output.nextStep.signInStep) {
    case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
    case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
    case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
      setCurrentState(output);
      setIsLoading(false);
      break;
    case "DONE":
      window.location.reload();
      break;
    default:
      handleError(
        `Unhandled sign in next step: ${output?.nextStep.signInStep}. Please contact support.`,
      );
      setIsLoading(false);
      break;
  }
}
