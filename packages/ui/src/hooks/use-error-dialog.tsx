import { useRef, useState } from "react";

type props = {
  onAction?: () => void;
};

export type ErrorDialogHook = {
  isErrorDialogOpen: boolean;
  openErrorDialog: (title: string, msg: string) => void;
  closeErrorDialog: () => void;
  action: () => void;
  errorMsg: string;
  errorTitle: string;
};

export function useErrorDialog({ onAction }: props): ErrorDialogHook {
  const [isOpen, setIsOpen] = useState(false);
  const errorTitle = useRef("");
  const errorMsg = useRef("");

  const open = (title: string, msg: string) => {
    setIsOpen(true);
    errorTitle.current = title;
    errorMsg.current = msg;
  };

  const close = () => {
    setIsOpen(false);
    errorTitle.current = "";
    errorMsg.current = "";
  };

  const action = () => {
    onAction?.();
    close();
  };

  return {
    isErrorDialogOpen: isOpen,
    openErrorDialog: open,
    closeErrorDialog: close,
    action,
    errorMsg: errorMsg.current,
    errorTitle: errorTitle.current,
  };
}
