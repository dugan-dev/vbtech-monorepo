"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { updateUmCaseAction } from "@/actions/update-um-case-action";
import { useWorklistContext } from "@/contexts/worklist-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { CaseFormInput, CaseFormSchema } from "./case-form-schema";

type props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: CaseFormInput;
  casePubId: string;
};

export function CaseReviewSheet({
  open,
  onOpenChange,
  values,
  casePubId,
}: props) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const revalidationPath = usePathname();
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { clients, healthPlans } = useWorklistContext();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CaseFormInput>({
    resolver: zodResolver(CaseFormSchema),
    defaultValues: values,
  });

  useEffect(() => {
    reset(values);
  }, [values, reset]);

  const escalatedToMD = useWatch({ control, name: "escalatedToMD" });
  const followUpAction = useWatch({ control, name: "followUpAction" });
  const clientPubId = useWatch({ control, name: "clientPubId" });

  const [isPending, startTransition] = useTransition();

  const { execute } = useAction(updateUmCaseAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The case has been updated successfully.",
      });
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  const handleSheetClose = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onOpenChange(false);
  };

  const onSubmit = (data: CaseFormInput) => {
    startTransition(() => {
      execute({
        formData: data,
        pubId: casePubId,
        revalidationPath,
      });
    });
  };

  return (
    <>
      <ErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={closeErrorDialog}
        description={errorMsg}
        title={errorTitle}
      />
      <Sheet open={open} onOpenChange={handleSheetClose}>
        <SheetContent
          side="bottom"
          className="size-full overflow-y-auto [&>button]:hidden"
        >
          <SheetHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle>Review Case</SheetTitle>
                <SheetDescription>
                  Update case details and status for utilization management
                  review
                </SheetDescription>
              </div>
              <div className="ml-4 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleSheetClose()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="mx-auto max-w-7xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
              {/* Case Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Case Information
                </h3>

                <div className="grid gap-4 lg:grid-cols-4">
                  <Field>
                    <FieldLabel htmlFor="caseId">
                      Case ID <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="caseId"
                      control={control}
                      rules={{ required: "Case ID is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="caseId"
                          placeholder="Enter case ID"
                        />
                      )}
                    />
                    <FieldError errors={[errors.caseId]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="clientPubId">
                      Client Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="clientPubId"
                      control={control}
                      rules={{ required: "Client is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="clientPubId">
                            <SelectValue placeholder="Select a Client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem
                                value={client.value}
                                key={client.value}
                              >
                                {client.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.clientPubId]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="planPubId">
                      Health Plan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="planPubId"
                      control={control}
                      rules={{ required: "Health plan is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="planPubId">
                            <SelectValue placeholder="Select a Health Plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {healthPlans
                              .filter(
                                (plan) => plan.clientPubId === clientPubId,
                              )
                              .map((plan) => (
                                <SelectItem value={plan.pubId} key={plan.pubId}>
                                  {plan.planName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.planPubId]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="procedureCode">
                      Procedure Code <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="procedureCode"
                      control={control}
                      rules={{ required: "Procedure code is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="procedureCode"
                          placeholder="Enter procedure code"
                          className="font-mono"
                        />
                      )}
                    />
                    <FieldError errors={[errors.procedureCode]} />
                  </Field>
                </div>
              </div>

              <Separator />

              {/* Review Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Review Details
                </h3>

                <div className="grid gap-4 lg:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="status">
                      Status <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not reviewed">
                              Not reviewed
                            </SelectItem>
                            <SelectItem value="Under Review">
                              Under Review
                            </SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                            <SelectItem value="Moved to MD">
                              Moved to MD
                            </SelectItem>
                            <SelectItem value="Offer P2P">Offer P2P</SelectItem>
                            <SelectItem value="P2P Scheduled">
                              P2P Scheduled
                            </SelectItem>
                            <SelectItem value="Denied">Denied</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.status]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="followUpAction">
                      Follow Up Action
                    </FieldLabel>
                    <Controller
                      name="followUpAction"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "P2P Scheduled") {
                              setValue("p2pSuccessful", "N/A");
                            }
                          }}
                        >
                          <SelectTrigger id="followUpAction">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N/A">N/A</SelectItem>
                            <SelectItem value="P2P Offer - Outbound #1">
                              P2P Offer - Outbound #1
                            </SelectItem>
                            <SelectItem value="P2P Offer - Outbound #2">
                              P2P Offer - Outbound #2
                            </SelectItem>
                            <SelectItem value="P2P Scheduled">
                              P2P Scheduled
                            </SelectItem>
                            <SelectItem value="Asking for more Information">
                              Asking for more Information
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.followUpAction]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="p2pSuccessful">
                      P2P Successful?
                    </FieldLabel>
                    <Controller
                      name="p2pSuccessful"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={followUpAction !== "P2P Scheduled"}
                        >
                          <SelectTrigger id="p2pSuccessful">
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N/A">N/A</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.p2pSuccessful]} />
                  </Field>
                </div>
              </div>

              <Separator />

              {/* MD Escalation Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  MD Escalation
                </h3>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="escalatedToMD">
                      Escalated to MD Reviewer?
                    </FieldLabel>
                    <Controller
                      name="escalatedToMD"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "No") {
                              setValue("mdName", "");
                            }
                          }}
                        >
                          <SelectTrigger id="escalatedToMD">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.escalatedToMD]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="mdName">
                      MD Name{" "}
                      {escalatedToMD === "Yes" && (
                        <span className="text-destructive">*</span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="mdName"
                      control={control}
                      rules={{
                        required:
                          escalatedToMD === "Yes"
                            ? "MD name is required when escalated"
                            : false,
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={escalatedToMD !== "Yes"}
                        >
                          <SelectTrigger id="mdName">
                            <SelectValue placeholder="Select MD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Rahul Singal">
                              Rahul Singal
                            </SelectItem>
                            <SelectItem value="Ben Horton">
                              Ben Horton
                            </SelectItem>
                            <SelectItem value="Raphael Sung">
                              Raphael Sung
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.mdName]} />
                  </Field>
                </div>
              </div>

              <Separator />

              {/* Remarks Section */}
              <Field>
                <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="remarks"
                      placeholder="Add any additional notes or comments..."
                      rows={6}
                      className="resize-none"
                    />
                  )}
                />
                <FieldError errors={[errors.remarks]} />
              </Field>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without
              saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Close Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
