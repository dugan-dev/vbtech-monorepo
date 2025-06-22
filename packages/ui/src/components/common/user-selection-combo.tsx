"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { UserSelectionData } from "@workspace/ui/types/user-selection-data";

type UserSelectionComboProps = UserSelectionData & {
  instructText: string;
  notFoundText: string;
  searchText: string;
  updateSelection: (vars: { slug: string }) => void;
  icons: {
    chevronsUpDown: React.ReactNode;
    check: React.ReactNode;
    lock: React.ReactNode;
    unlock: React.ReactNode;
  };
  value: string;
  onValueChange: (value: string) => void;
};

export function UserSelectionCombo({
  comboItems,
  defaultLock,
  slug,
  instructText,
  notFoundText,
  searchText,
  updateSelection,
  icons,
  value,
  onValueChange,
}: UserSelectionComboProps) {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(defaultLock);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && slug && slug !== value && defaultLock) {
      hasInitialized.current = true;
      setIsLocked(true);
      // Force immediate update without transition
      onValueChange(slug);
    }
  }, [slug, value, defaultLock, onValueChange]);
  function toggleLock() {
    if (isLocked) {
      updateSelection({ slug: "" });
      setIsLocked(false);
    } else {
      updateSelection({ slug: value });
      setIsLocked(true);
    }
  }

  const selectedItem = comboItems.find((item) => {
    const itemValue =
      typeof item.value === "string" ? item.value : item.selectionDisplay;
    return itemValue?.toLowerCase() === value.toLowerCase();
  });

  return (
    <div className="flex items-center gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-80 justify-between bg-card"
            disabled={isLocked}
          >
            <span className="flex-1 truncate text-left">
              <span className="flex-1 truncate text-left">
                {value && selectedItem ? selectedItem.label : instructText}
              </span>
            </span>
            {icons.chevronsUpDown}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder={searchText} className="h-9" />
            <CommandList>
              <CommandEmpty>{notFoundText}</CommandEmpty>
              <ScrollArea className="h-72">
                <CommandGroup>
                  {comboItems.map((val) => (
                    <CommandItem
                      key={val.value as string}
                      value={val.value as string}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      {val.label}
                      <div
                        className={cn(
                          "ml-auto",
                          value === val.value ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {icons.check}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLock}
        className="relative overflow-hidden"
        disabled={value === ""}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
            }`}
          >
            {icons.lock}
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
            }`}
          >
            {icons.unlock}
          </div>
        </div>
        <span className="sr-only">{isLocked ? "Locked" : "Unlocked"}</span>
      </Button>
    </div>
  );
}
