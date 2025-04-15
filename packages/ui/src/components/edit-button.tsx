import { Dispatch, SetStateAction } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

type props = {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  userCanEdit: boolean;
};

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
