import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";

import { handleContactFormSubmissionAction } from "../actions/handle-contact-form-submission-action";
import {
  ContactFormData,
  ContactFormSchema,
} from "../components/contact-form-schema";

export function useContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { execute, isPending } = useAction(handleContactFormSubmissionAction, {
    onError: ({ error }) => {
      openErrorDialog(
        "Error",
        error.validationErrors
          ? "Invalid inputs. Please double check the data and try again. If the problem persists please contact support."
          : error.serverError
            ? error.serverError
            : (error as string),
      );
    },
    onSuccess: (data) => {
      const { success, message } = data?.data as {
        success: boolean;
        message: string;
      };
      if (success) {
        toast("Success", {
          description: message,
        });
        setIsSubmitted(true);
      } else {
        openErrorDialog("Error Sending Message", message);
      }
    },
  });

  // Initialize react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
      phone: "",
      serviceInterest: "consulting",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (formData: ContactFormData) => {
    execute({ formData });
  };

  const handleReset = () => {
    form.reset();
  };

  return {
    isSubmitted,
    setIsSubmitted,
    handleReset,
    onSubmit,
    form,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isPending,
  };
}
