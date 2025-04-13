import { redirect, unauthorized } from "next/navigation";
import { getVBPayLicense } from "@/repos/license-repository";
import { Home, Setup } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { checkPageRateLimit } from "@/utils/check-page-rate-limit";

import { StandardLayout } from "@/components/standard-layout";

export default async function Page() {
  await checkPageRateLimit({ pathname: Home({}) });

  const [user, license] = await Promise.all([
    authenticatedUser(),
    getVBPayLicense(),
  ]);

  if (!user) {
    return unauthorized();
  }

  if (!license) {
    return redirect(Setup({}));
  }

  return (
    <StandardLayout>
      <h1>Home</h1>
    </StandardLayout>
  );
}
