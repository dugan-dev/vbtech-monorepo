import { Dispatch, SetStateAction } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

type props = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  userCanEdit: boolean;
};

/**
 * Renders an edit button that enables editing mode when clicked.
 *
 * The button is disabled if the user does not have permission to edit.
 *
 * @param setIsEditing - Function to toggle editing mode.
 * @param userCanEdit - Indicates whether the user has permission to edit.
 */
export function EditButton({ setIsEditing, userCanEdit }: props) {
  return (
    <Button onClick={() => setIsEditing(true)} disabled={!userCanEdit}>
      <div className="flex items-center gap-2">
        <Pencil className="size-4" />
        <span>Edit</span>
      </div>
    </Button>
  );
}
