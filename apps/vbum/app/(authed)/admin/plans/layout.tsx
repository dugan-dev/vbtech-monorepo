import { PropsWithChildren } from "react";
import { getUserSelectionData } from "@/repos/user-repository";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Asynchronous React layout component that wraps its children with a standard layout and provides user selection data.
 *
 * Fetches user selection data and passes it to the {@link StandardLayout} component, rendering the given children within it.
 *
 * @param children - React nodes to be rendered inside the layout.
 */
export default async function Layout({ children }: PropsWithChildren) {
  const userSelectionData = await getUserSelectionData();
  return (
    <StandardLayout userSelectionData={userSelectionData}>
      {children}
    </StandardLayout>
  );
}
