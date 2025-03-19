import { usePathname } from "next/navigation";

import { useErrorDialog } from "@/hooks/use-error-dialog";

export function useUserManagementTable() {
  const revalidationPath = usePathname();

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  return {
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  };
}
