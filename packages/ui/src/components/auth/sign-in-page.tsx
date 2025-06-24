"use client";

import { SignInCardClient } from "@workspace/ui/components/auth/sign-in-card-client";

/**
 * Props for the SignInPage component.
 */
type SignInPageProps = {
  /** Logo JSX for light mode */
  Logo: React.ReactNode;
  /** Logo JSX for dark mode */
  LogoDark: React.ReactNode;
  /** Loader icon JSX */
  LoaderIcon: React.ReactNode;
};

/**
 * A complete sign-in page component that manages the authentication flow.
 *
 * This component provides the page-level structure and state management for
 * the sign-in process. It uses the shared SignInCard component and handles
 * all the authentication state logic through the useSignInCard and useSignInForm hooks.
 *
 * The component accepts app-specific form components as props, allowing each
 * app to customize the individual forms while sharing the overall structure
 * and state management.
 *
 * @param props - Configuration object containing app-specific form components and icons
 * @returns SignInPage component with complete authentication flow
 */
export function SignInPage({ Logo, LogoDark, LoaderIcon }: SignInPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignInCardClient
        Logo={Logo}
        LogoDark={LogoDark}
        LoaderIcon={LoaderIcon}
      />
    </main>
  );
}
