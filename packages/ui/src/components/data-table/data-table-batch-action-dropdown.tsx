"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface props<TData> {
  table: Table<TData>;
  onAction: (action: string, ids: string[]) => void;
}

export function DataTableBatchActionDropdown<TData>({
  table,
  onAction,
}: props<TData>) {
  // tanstack/react-table is not compatible with react compilier so we need to opt-out of automatic memoization.
  "use no memo";

  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (actionType: "plans" | "adds") => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows
      .map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const original = row.original as any;
        return (
          original.capcfgPubId ?? original.clmcfgPubId ?? original.bnscfgPubId
        );
      })
      .filter(Boolean);

    onAction(actionType, ids);
    setIsOpen(false);
    table.toggleAllRowsSelected(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Actions
          <ChevronDown className="ml-2 size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAction("plans")}>
            Plan New Batch
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("adds")}>
            Add to Existing Batch
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
