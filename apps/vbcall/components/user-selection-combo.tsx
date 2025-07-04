"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { updateUserSelectionSlugAction } from "@/actions/update-user-selection-slug-action";
import { Check, ChevronsUpDown, Lock, Unlock } from "lucide-react";
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
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { cn } from "@workspace/ui/lib/utils";

import { UserSelectionData } from "@/types/user-selection-data";

/**
 * Renders a searchable combo box for selecting a user/client, with lock and unlock functionality.
 *
 * The component synchronizes the selected client ID with the URL query parameter `"cId"`, supports initializing from a provided slug, and allows toggling between locked and unlocked states. When locked, the selection cannot be changed until unlocked. Locking or unlocking triggers a server-side update and displays an error dialog if the update fails.
 *
 * @param comboItems - List of selectable items to display in the combo box.
 * @param defaultLock - Whether the combo box should be locked by default.
 * @param slug - Initial selected value to synchronize with the combo box and URL.
 *
 * @returns A React element rendering the combo box with lock/unlock controls and error handling.
 *
 * @remark The lock toggle is disabled if no client is selected. The combo box is disabled when locked.
 */
export function UserSelectionCombo({
  comboItems,
  defaultLock,
  slug,
}: UserSelectionData) {
  const [cId, setCId] = useQueryState(
    "cId",
    parseAsString
      .withDefault("")
      .withOptions({ startTransition, shallow: false }),
  );
  const [open, setOpen] = useState(false);
  const instructText = "Select Client...";
  const placehold = "Search...";
  const notFound = "Client Not Found";
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

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && slug && slug !== cId && defaultLock) {
      hasInitialized.current = true;
      setIsLocked(true);
      // Force immediate update without transition
      setCId(slug, { shallow: true });
    }
  }, [slug, cId, defaultLock, setCId]);
  function toggleLock() {
    if (isLocked) {
      execute({ slug: "" });
      setIsLocked(false);
    } else {
      execute({ slug: cId });
      setIsLocked(true);
    }
  }

  const selectedItem = comboItems.find((item) => {
    const itemValue =
      typeof item.value === "string" ? item.value : item.selectionDisplay;
    return itemValue?.toLowerCase() === cId.toLowerCase();
  });

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
              <span className="flex-1 truncate text-left">
                {cId && selectedItem ? selectedItem.label : instructText}
              </span>
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
                        setCId(currentValue);
                        setOpen(false);
                      }}
                    >
                      {val.label}
                      <Check
                        className={cn(
                          "ml-auto size-4",
                          cId === val.value ? "opacity-100" : "opacity-0",
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
        disabled={cId === ""}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
            }`}
          >
            <Lock className="size-5" />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-300 ease-in-out ${
              isLocked ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
            }`}
          >
            <Unlock className="size-5" />
          </div>
        </div>
        <span className="sr-only">{isLocked ? "Locked" : "Unlocked"}</span>
      </Button>
    </div>
  );
}
