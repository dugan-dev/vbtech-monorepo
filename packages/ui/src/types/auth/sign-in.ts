// AWS Amplify Auth types for sign-in flow

export type SignInResult = {
  isSignedIn: boolean;
  nextStep: {
    signInStep: string;
    totpSetupDetails?: {
      sharedSecret: string;
      getSetupUri: (appName: string, username: string) => URL;
    };
  };
};

export type SignInFunction = (params: {
  username: string;
  password: string;
}) => Promise<SignInResult>;

export type ConfirmSignInFunction = (params: {
  challengeResponse: string;
}) => Promise<SignInResult>;
