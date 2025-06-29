"use client";

import { startTransition, useEffect, useState } from "react";
import { updateUserSelectionSlugAction } from "@/actions/update-user-selection-slug-action";
import { useAction } from "next-safe-action/hooks";
import { parseAsString, useQueryState } from "nuqs";

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

import { UserSelectionData } from "@/types/user-selection-data";
import { useErrorDialog } from "@/hooks/use-error-dialog";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Icons } from "@/components/icons";

export function UserSelectionCombo({
  comboItems,
  defaultLock,
  slug,
}: UserSelectionData) {
  const [pId, setPId] = useQueryState(
    "pId",
    parseAsString
      .withDefault("")
      .withOptions({ startTransition, shallow: false }),
  );
  const [open, setOpen] = useState(false);
  const instructText = "Select Payer...";
  const placehold = "Search...";
  const notFound = "Payer Not Found";
  const [isLocked, setIsLocked] = useState(defaultLock);

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute } = useAction(updateUserSelectionSlugAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
  });

  useEffect(() => {
    if (slug && slug !== pId) {
      setIsLocked(true);
      // Force immediate update without transition
      setPId(slug, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, pId]);

  function toggleLock() {
    if (isLocked) {
      execute({ slug: "" });
      setIsLocked(false);
    } else {
      execute({ slug: pId });
      setIsLocked(true);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg}
          title={errorTitle}
        />
      )}
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
              {pId
                ? `${
                    comboItems.find((val) => {
                      if (typeof val.value === "string") {
                        return val.value.toLowerCase() === pId.toLowerCase();
                      }
                    })
                      ? comboItems.find((val) => {
                          if (typeof val.value === "string") {
                            return (
                              val.value.toLowerCase() === pId.toLowerCase()
                            );
                          }
                          return (
                            val.selectionDisplay?.toLowerCase() ===
                            pId.toLowerCase()
                          );
                        })?.label
                      : instructText
                  }`
                : instructText}
            </span>
            <Icons.chevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder={placehold} className="h-9" />
            <CommandList>
              <CommandEmpty>{notFound}</CommandEmpty>
              <ScrollArea className="h-72">
                <CommandGroup>
                  {comboItems.map((val) => (
                    <CommandItem
                      key={val.value as string}
                      value={val.value as string}
                      onSelect={(currentValue) => {
                        setPId(currentValue);
                        setOpen(false);
                      }}
                    >
                      {val.label}
                      <Icons.check
                        className={cn(
                          "ml-auto size-4",
                          pId === val.value ? "opacity-100" : "opacity-0",
                        )}
                      />
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
        disabled={pId === ""}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
            }`}
          >
            <Icons.lock className="size-5" />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
            }`}
          >
            <Icons.unlock className="size-5" />
          </div>
        </div>
        <span className="sr-only">{isLocked ? "Locked" : "Unlocked"}</span>
      </Button>
    </div>
  );
}
