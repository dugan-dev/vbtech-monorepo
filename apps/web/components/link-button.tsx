import Link from "next/link";

import { Button, ButtonProps } from "@workspace/ui/components/button";

interface props extends Pick<ButtonProps, "variant" | "size"> {
  href: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant, size, children }: props) {
  return (
    <Button variant={variant} size={size} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
