// Re-export all auth types for convenience

export type {
  SignInResult,
  SignInFunction,
  ConfirmSignInFunction,
} from "./sign-in";

export type {
  ResetPasswordResult,
  ResetPasswordFunction,
  ConfirmResetPasswordFunction,
} from "./password-reset";
