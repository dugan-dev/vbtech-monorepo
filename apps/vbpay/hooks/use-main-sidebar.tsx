import { UserType } from "@/types/user-type";
import {
  MAIN_SIDEBAR_ITEMS_BPO,
  MAIN_SIDEBAR_ITEMS_FACILITY,
  MAIN_SIDEBAR_ITEMS_PAYER,
  MAIN_SIDEBAR_ITEMS_PAYERS,
  MAIN_SIDEBAR_ITEMS_PHYSICIAN,
  MAIN_SIDEBAR_ITEMS_PO,
  MAIN_SIDEBAR_ITEMS_PRACTICE,
  MAIN_SIDEBAR_ITEMS_VENDOR,
} from "@/components/main-sidebar/main-sidebar-items";

export function useAppSidebarItems(
  userType: UserType | undefined,
  slug: string | undefined,
) {
  if (!userType) return [];

  const sidebarItemsMap = {
    bpo: MAIN_SIDEBAR_ITEMS_BPO,
    payers: MAIN_SIDEBAR_ITEMS_PAYERS,
    payer: () => MAIN_SIDEBAR_ITEMS_PAYER(slug ?? ""),
    po: () => MAIN_SIDEBAR_ITEMS_PO(slug ?? ""),
    practice: () => MAIN_SIDEBAR_ITEMS_PRACTICE(slug ?? ""),
    facility: () => MAIN_SIDEBAR_ITEMS_FACILITY(slug ?? ""),
    physician: () => MAIN_SIDEBAR_ITEMS_PHYSICIAN(slug ?? ""),
    vendor: () => MAIN_SIDEBAR_ITEMS_VENDOR(slug ?? ""),
  };

  const itemsOrFunction = sidebarItemsMap[userType];
  return typeof itemsOrFunction === "function"
    ? itemsOrFunction()
    : itemsOrFunction;
}
