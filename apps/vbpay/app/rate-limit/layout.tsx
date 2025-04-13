import { PropsWithChildren } from "react";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders a standard layout that wraps the provided children.
 *
 * This component serves as a simple wrapper to apply a consistent layout structure by rendering
 * its children within the StandardLayout component.
 *
 * @param children - The content to display within the layout.
 */
export default function Layout({ children }: PropsWithChildren) {
  return <StandardLayout>{children}</StandardLayout>;
}
