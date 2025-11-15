"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { insertUmCaseAction } from "@/actions/insert-um-case-action";
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
import {
  Field,
  FieldLabel,
  FieldDescription as FormFieldDescription,
  FieldError as FormFieldError,
} from "@workspace/ui/components/field";
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
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { useErrorDialog } from "@workspace/ui/hooks/use-error-dialog";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import {
  CaseFormDefaultValues,
  CaseFormInput,
  CaseFormSchema,
} from "./case-form-schema";

type props = {
  children: React.ReactNode;
};

export function NewCaseSheet({ children }: props) {
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const revalidationPath = usePathname();
  const {
    openErrorDialog,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useErrorDialog({});

  const { clients, healthPlans, nurses } = useWorklistContext();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
    setValue,
    reset,
  } = useForm<CaseFormInput>({
    resolver: zodResolver(CaseFormSchema),
    defaultValues: CaseFormDefaultValues,
  });

  const escalatedToMD = useWatch({ control, name: "escalatedToMD" });
  const clientPubId = useWatch({ control, name: "clientPubId" });
  const followUpAction = useWatch({ control, name: "followUpAction" });

  const handleOpenChange = (shouldOpen: boolean) => {
    if (shouldOpen) {
      setOpen(true);
    } else {
      if (isDirty) {
        setShowConfirmDialog(true);
      } else {
        setOpen(false);
      }
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setOpen(false);
  };

  const { execute } = useAction(insertUmCaseAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The case has been created successfully.",
      });
      setOpen(false);
      reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  const onSubmit = (data: CaseFormInput) => {
    startTransition(() => {
      execute({
        revalidationPath,
        formData: data,
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
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          side="bottom"
          className="size-full overflow-y-auto [&>button]:hidden"
        >
          <SheetHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle>Add New Case</SheetTitle>
                <SheetDescription>
                  Create a new utilization management review case
                </SheetDescription>
              </div>
              <div className="ml-4 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || isPending}
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
                    <FormFieldError errors={[errors.caseId]} />
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
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem
                                key={client.value}
                                value={client.value}
                              >
                                {client.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.clientPubId]} />
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
                          disabled={!clientPubId}
                        >
                          <SelectTrigger id="planPubId">
                            <SelectValue placeholder="Select health plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {healthPlans
                              .filter(
                                (plan) => plan.clientPubId === clientPubId,
                              )
                              .map((plan) => (
                                <SelectItem key={plan.pubId} value={plan.pubId}>
                                  {plan.planName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {!clientPubId && (
                      <FormFieldDescription>
                        Select a client first
                      </FormFieldDescription>
                    )}
                    <FormFieldError errors={[errors.planPubId]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="assignedTo">
                      Assigned Nurse <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="assignedTo"
                      control={control}
                      rules={{ required: "Nurse is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="assignedTo">
                            <SelectValue placeholder="Select Nurse Reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {nurses
                              .filter(
                                (nurse) => nurse.appAttrs?.type === "nurse",
                              )
                              .map((nurse) => (
                                <SelectItem
                                  key={nurse.userId}
                                  value={nurse.userId}
                                >
                                  {`${nurse.firstName} ${nurse.lastName}`}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.assignedTo]} />
                  </Field>
                </div>
              </div>

              <Separator />

              {/* Review Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Review Details
                </h3>

                <div className="grid gap-4 lg:grid-cols-4">
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
                        />
                      )}
                    />
                    <FormFieldError errors={[errors.procedureCode]} />
                  </Field>

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
                    <FormFieldError errors={[errors.status]} />
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
                    <FormFieldError errors={[errors.followUpAction]} />
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
                    <FormFieldError errors={[errors.p2pSuccessful]} />
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
                    <FormFieldError errors={[errors.escalatedToMD]} />
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
                    <FormFieldError errors={[errors.mdName]} />
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
                      placeholder="Add any initial notes or comments..."
                      rows={6}
                      className="resize-none"
                    />
                  )}
                />
                <FormFieldError errors={[errors.remarks]} />
              </Field>
            </form>
          </div>
        </SheetContent>
      </Sheet>

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
