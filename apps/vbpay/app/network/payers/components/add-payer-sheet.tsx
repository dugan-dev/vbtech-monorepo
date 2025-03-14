"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Icons } from "@/components/icons";

import { AddPayerForm } from "./add-payer-form/add-payer-form";

type props = {
  payerTypes: ComboItem[];
};

export function AddPayerSheet({ payerTypes }: props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSuccess = () => {
    setSheetOpen(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          Add Payer
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col gap-2 mx-auto flex-1 xl:max-w-[80dvw]">
          <SheetHeader>
            <SheetTitle className="text-4xl font-semibold">
              Add New Payer
            </SheetTitle>
          </SheetHeader>
          <AddPayerForm onSuccess={handleSuccess} payerTypes={payerTypes} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
