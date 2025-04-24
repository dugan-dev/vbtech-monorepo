import { PropsWithChildren } from "react";

import { StandardLayout } from "@/components/standard-layout";

export default function Layout({ children }: PropsWithChildren) {
  return <StandardLayout>{children}</StandardLayout>;
}
