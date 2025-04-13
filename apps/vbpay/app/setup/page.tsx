import { getVBPayLicense } from "@/repos/license-repository";

import "server-only";

import { redirect } from "next/navigation";
import { Home, Setup, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { NotSetupView } from "./components/not-setup-view";

export default async function Page() {
  // Check rate limiter
  await checkPageRateLimit({ pathname: Setup({}) });

  // check if user is signed in and if the app is licensed.
  const [license, user] = await Promise.all([
    getVBPayLicense(),
    authenticatedUser(),
  ]);

  // If the user is not signed in, redirect them to the sign in page
  if (!user) {
    return redirect(SignIn({}));
  }

  // If the app is licensed, redirect them to the home page
  if (license) {
    return redirect(Home({}));
  }

  return <NotSetupView userId={user.userId} />;
}
