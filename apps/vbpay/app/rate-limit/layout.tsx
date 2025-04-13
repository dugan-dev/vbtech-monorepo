import { PropsWithChildren } from "react";

import { StandardLayout } from "@/components/standard-layout";

/**
 * Renders children within a standard layout container.
 *
 * This component wraps its child elements with StandardLayout, ensuring consistent styling and structure.
 *
 * @param children - The elements to be displayed within the layout.
 */
export default function Layout({ children }: PropsWithChildren) {
  return <StandardLayout>{children}</StandardLayout>;
}
