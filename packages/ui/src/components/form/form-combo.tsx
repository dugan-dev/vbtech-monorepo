"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control } from "react-hook-form";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { ComboItem } from "@workspace/ui/types/combo-item";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  label: React.ReactNode;
  name: string;
  comboItems: ComboItem[];
  instructionText?: string;
  placeholder?: string;
  notFoundText?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  infoHover?: React.ReactNode;
  className?: string;
  showFormMessageWithLabel?: boolean;
  selectionPrefix?: string;
};

export function FormCombo({
  control,
  label,
  name,
  comboItems,
  instructionText,
  placeholder,
  notFoundText = "Not found",
  isDisabled,
  isRequired,
  infoHover,
  className,
  showFormMessageWithLabel = false,
  selectionPrefix,
}: props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            <div className="flex items-center">
              {label}
              {isRequired && (
                <span className="text-md ms-2 font-extrabold text-red-600">
                  *
                </span>
              )}
              {infoHover && infoHover}
              {showFormMessageWithLabel && <FormMessage />}
            </div>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={isDisabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                    className,
                  )}
                >
                  <span className="flex-1 truncate text-left">
                    {field.value
                      ? `${selectionPrefix ?? ""}${
                          comboItems.find((val) => val.value === field.value)
                            ?.selectionDisplay ||
                          comboItems.find((val) => val.value === field.value)
                            ?.label
                        }`
                      : (instructionText ?? placeholder ?? "")}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command
                filter={(value, search) => {
                  const item = comboItems.find((item) => item.value === value);
                  if (!item) return 0;

                  const searchLower = search.toLowerCase();
                  const valueLower = item.value.toLowerCase();
                  const displayLower = String(
                    item.selectionDisplay || item.label,
                  ).toLowerCase();

                  if (valueLower.includes(searchLower)) return 1;
                  if (displayLower.includes(searchLower)) return 1;

                  return 0;
                }}
              >
                <CommandInput
                  placeholder={placeholder ?? "Search..."}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{notFoundText}</CommandEmpty>
                  <ScrollArea className="h-72">
                    <CommandGroup>
                      {comboItems.map((item) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={() => {
                            field.onChange(item.value);
                          }}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto size-4",
                              item.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <ScrollBar
                      orientation="vertical"
                      className="bg-secondary"
                    />
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
