// AWS Amplify Auth types for password reset flow

export type ResetPasswordResult = {
  isPasswordReset: boolean;
  nextStep: {
    resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE" | "DONE";
  };
};

export type ResetPasswordFunction = (params: {
  username: string;
}) => Promise<ResetPasswordResult>;

export type ConfirmResetPasswordFunction = (params: {
  username: string;
  confirmationCode: string;
  newPassword: string;
}) => Promise<void>;
