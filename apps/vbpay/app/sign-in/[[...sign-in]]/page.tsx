import { redirect } from "next/navigation";
import { Home, SignIn as SignInRoute } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { SignInCard } from "./components/sign-in-card";

export default async function SignIn() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: SignInRoute({}) }),
  ]);

  if (user) {
    return redirect(Home({}));
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignInCard />
    </main>
  );
}
