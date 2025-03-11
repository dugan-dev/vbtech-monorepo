import { ComboItem } from "@workspace/ui/types/combo-item";

export type PayerSelectionData = {
  defaultLock: boolean;
  selectedPayerPubId: string | undefined;
  comboItems: ComboItem[];
};
