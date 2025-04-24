import { PropsWithChildren } from "react";
import { getUserSelectionData } from "@/repos/user-repository";

import { StandardLayout } from "@/components/standard-layout";

export default async function Layout({ children }: PropsWithChildren) {
  const userSelectionData = await getUserSelectionData();
  return (
    <StandardLayout userSelectionData={userSelectionData}>
      {children}
    </StandardLayout>
  );
}
