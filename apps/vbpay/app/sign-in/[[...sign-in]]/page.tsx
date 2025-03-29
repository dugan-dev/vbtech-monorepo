import { redirect } from "next/navigation";
import { Home } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { SignInCard } from "./components/sign-in-card";

export default async function SignIn() {
  const user = await authenticatedUser();

  if (user) {
    return redirect(Home({}));
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignInCard />
    </main>
  );
}
