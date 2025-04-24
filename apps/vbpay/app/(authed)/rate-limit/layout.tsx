import { PropsWithChildren } from "react";

import { StandardLayout } from "@/components/standard-layout";

/**
 * A layout component that wraps its children with the StandardLayout.
 *
 * This component provides a consistent layout structure by embedding its children within the StandardLayout.
 *
 * @param children - The content to be rendered inside the layout.
 */
export default function Layout({ children }: PropsWithChildren) {
  return <StandardLayout>{children}</StandardLayout>;
}
