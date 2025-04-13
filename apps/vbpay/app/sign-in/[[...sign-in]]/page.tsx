import { redirect } from "next/navigation";
import { Home, SignIn } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { SignInCard } from "./components/sign-in-card";

export default async function Page() {
  const [user] = await Promise.all([
    authenticatedUser(),
    checkPageRateLimit({ pathname: SignIn({}) }),
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
