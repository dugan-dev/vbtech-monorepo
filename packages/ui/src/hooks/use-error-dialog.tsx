import { useState } from "react";

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
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const open = (title: string, msg: string) => {
    setErrorTitle(title);
    setErrorMsg(msg);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setErrorTitle("");
    setErrorMsg("");
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
    errorMsg,
    errorTitle,
  };
}
