export function handleSignInNextStep<
  T extends { nextStep: { signInStep: string } },
>(
  output: T,
  setCurrentState: React.Dispatch<React.SetStateAction<T | null>>,
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
