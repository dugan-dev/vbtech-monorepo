import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

type props = {
  href: string;
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "link"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
};

export function LinkButton({ href, variant, size, children }: props) {
  return (
    <Button variant={variant} size={size} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
