"use client";

import { useTheme } from "next-themes";

import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { Icons } from "@/components/icons";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme((prev) => (prev === "light" ? "dark" : "light"))
          }
        >
          <Icons.sun className="size-5 dark:hidden" />
          <Icons.moon className="hidden size-5 dark:block" />
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
