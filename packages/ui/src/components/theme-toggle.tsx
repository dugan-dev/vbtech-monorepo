"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        >
          <Sun className="size-5 dark:hidden" aria-hidden="true" />
          <Moon className="hidden size-5 dark:block" aria-hidden="true" />
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
