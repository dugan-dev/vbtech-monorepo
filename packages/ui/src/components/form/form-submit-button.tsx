import { Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

type props = {
  isDisabled?: boolean;
  isSaving: boolean;
  label?: string;
  labelSaving?: string;
};

export function FormSubmitButton({
  isDisabled,
  isSaving,
  label = "Save",
  labelSaving = "Saving...",
}: props) {
  return (
    <Button type="submit" disabled={isDisabled || isSaving}>
      {isSaving ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>{labelSaving}</span>
        </div>
      ) : (
        label
      )}
    </Button>
  );
}
