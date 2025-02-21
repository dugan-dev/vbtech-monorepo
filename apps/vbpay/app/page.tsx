import { Button } from "@workspace/ui/components/button";

/**
 * Renders a page with centered content.
 *
 * This component displays a bold "Hello World" heading alongside a small button. The layout uses
 * flexbox utilities to ensure the content is both vertically and horizontally centered within
 * the viewport.
 */
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
