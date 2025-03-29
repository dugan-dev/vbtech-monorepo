import { redirect, unauthorized } from "next/navigation";
import { getVBPayLicense } from "@/repos/license-repository";
import { Setup } from "@/routes";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { StandardLayout } from "@/components/standard-layout";

export default async function Page() {
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
