import { ComboItem } from "@workspace/ui/types/combo-item";

export type UserSelectionData = {
  defaultLock: boolean;
  slug: string | undefined;
  comboItems: ComboItem[];
};
