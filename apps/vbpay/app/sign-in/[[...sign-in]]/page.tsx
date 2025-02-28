import { redirect } from "next/navigation";

import { SignInCard } from "./components/sign-in-card/sign-in-card";

interface SignInProps {
  searchParams: Promise<{
    redirect_url?: string;
  }>;
}

export default async function SignIn({ searchParams }: SignInProps) {
  // TODO: Add auth check
  // const userId = await auth.getUserId();
  const userId = null;
  const { redirect_url } = await searchParams;

  if (userId) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignInCard redirect_url={redirect_url} />
    </main>
  );
}
