"use client";

import type React from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { insertUmCaseAction } from "@/actions/insert-um-case-action";
import { updateUmCaseAction } from "@/actions/update-um-case-action";
import { useWorklistContext } from "@/contexts/worklist-context";
import { calculateDueDate, formatDueDate } from "@/utils/calculate-due-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, toDate } from "date-fns";
import { CalendarIcon, Loader2, Plus, Save, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { parseAsString, useQueryState } from "nuqs";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { Calendar } from "@workspace/ui/components/calendar";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Field,
  FieldLabel,
  FieldDescription as FormFieldDescription,
  FieldError as FormFieldError,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
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
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "@workspace/utils/format-date";
import { getErrorMessage } from "@workspace/utils/get-error-message";

import { CaseFollowUpActions } from "@/types/case-follow-up-action";
import {
  CaseStatuses,
  ClosedCaseStatuses,
  type CaseStatus,
} from "@/types/case-status";
import { CaseTypeLabels, CaseTypes } from "@/types/case-type";
import { MDCaseRecommendations } from "@/types/md-case-recommendation";

import { ProcedureCodeInput } from "../procedure-code-input";
import {
  CaseFormDefaultValues,
  CaseFormInput,
  CaseFormSchema,
  umCaseToFormData,
} from "./case-form-schema";
import { CaseHistoryDialogClient } from "./case-history-dialog-client";

const MAX_PROCEDURE_CODES = 30;

type CaseSheetProps = {
  mode: "new" | "review";
  children?: React.ReactNode;
};

/**
 * Renders a form-based sheet for creating a new utilization management case or reviewing/updating an existing case.
 *
 * The component manages open state (local for "new", URL-driven for "review"), form state and validation, computed fields
 * (due date and TAT), dynamic procedure codes, conditional fields and validation for MD escalation and follow-up actions,
 * and submit flows for inserting or updating cases with success and error handling.
 *
 * @param mode - "new" to render a creatable case sheet (uses an internal trigger), "review" to open for a selected case via URL state
 * @param children - Optional trigger node(s) rendered when `mode` is "new"; ignored in "review" mode
 * @returns A React element containing the case sheet UI (modal bottom sheet) with form controls, actions, and confirmation dialogs
 */
export function CaseSheet({ mode, children }: CaseSheetProps) {
  // State management for new mode
  const [localOpen, setLocalOpen] = useState(false);

  // State management for review mode
  const [caseId, setCaseId] = useQueryState(
    "caseId",
    parseAsString.withOptions({ shallow: false }),
  );

  // Determine which open state to use
  const open = mode === "new" ? localOpen : !!caseId;

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

  const {
    clients,
    healthPlans,
    nurses,
    physicians,
    caseHistory,
    selectedCase,
  } = useWorklistContext();

  // Derive form values based on mode
  const values = useMemo(() => {
    if (mode === "review" && selectedCase) {
      return umCaseToFormData(selectedCase);
    }
    return CaseFormDefaultValues;
  }, [mode, selectedCase]);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
    setValue,
    reset,
  } = useForm<CaseFormInput>({
    resolver: zodResolver(CaseFormSchema),
    defaultValues: values,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedureCodes",
  });

  // Reset form when values change (review mode)
  useEffect(() => {
    if (open && mode === "review") {
      reset(values);
    }
  }, [values, reset, open, mode]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      reset(CaseFormDefaultValues);
    }
  }, [open, reset]);

  const escalatedToMD = useWatch({ control, name: "escalatedToMD" });
  const clientPubId = useWatch({ control, name: "clientPubId" });
  const mdRecommended = useWatch({ control, name: "mdRecommended" });
  const recdDate = useWatch({ control, name: "recdDate" });
  const planPubId = useWatch({ control, name: "planPubId" });
  const caseType = useWatch({ control, name: "caseType" });
  const status = useWatch({ control, name: "status" });
  const physPubId = useWatch({ control, name: "physPubId" });

  // Find the selected health plan
  const selectedHealthPlan = healthPlans.find((hp) => hp.pubId === planPubId);

  // Calculate due date when we have received date and health plan
  const dueDate =
    recdDate && selectedHealthPlan && caseType
      ? calculateDueDate(
          recdDate,
          caseType,
          selectedHealthPlan.tatStandard,
          selectedHealthPlan.tatExpedited,
        )
      : null;

  // Get the applicable TAT days
  const tatDays =
    selectedHealthPlan && caseType
      ? caseType === "Expedited"
        ? selectedHealthPlan.tatExpedited
        : selectedHealthPlan.tatStandard
      : null;

  const handleOpenChange = (shouldOpen: boolean) => {
    if (shouldOpen) {
      if (mode === "new") {
        setLocalOpen(true);
      }
      // Review mode is controlled by URL params, so we don't set anything here
    } else {
      if (isDirty) {
        setShowConfirmDialog(true);
      } else {
        if (mode === "new") {
          setLocalOpen(false);
        } else {
          setCaseId(null);
        }
      }
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    if (mode === "new") {
      setLocalOpen(false);
    } else {
      setCaseId(null);
    }
  };

  const handleClientChange = () => {
    setValue("planPubId", "");
  };

  // Action for new mode
  const { execute: executeInsert } = useAction(insertUmCaseAction, {
    onSuccess: () => {
      toast("Success", {
        description: "The case has been created successfully.",
      });
      setLocalOpen(false);
      reset();
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  // Action for review mode
  const { execute: executeUpdate } = useAction(updateUmCaseAction, {
    onSuccess: () => {
      setTimeout(() => {
        setCaseId(null);
      }, 0);
      toast("Success", {
        description: "The case has been updated successfully.",
      });
    },
    onError: ({ error }) => {
      openErrorDialog("Error", getErrorMessage(error));
    },
  });

  const onSubmit = (data: CaseFormInput) => {
    startTransition(() => {
      if (mode === "new") {
        executeInsert({
          revalidationPath,
          formData: data,
        });
      } else {
        if (!selectedCase) return;
        executeUpdate({
          formData: data,
          pubId: selectedCase.pubId,
          revalidationPath,
        });
      }
    });
  };

  const sheetContent = (
    <>
      <ErrorDialog
        open={isErrorDialogOpen}
        onOpenChange={closeErrorDialog}
        description={errorMsg}
        title={errorTitle}
      />
      <Sheet open={open} onOpenChange={handleOpenChange}>
        {mode === "new" && <SheetTrigger asChild>{children}</SheetTrigger>}
        <SheetContent
          side="bottom"
          className="size-full overflow-y-auto [&>button]:hidden"
        >
          <SheetHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle>
                  {mode === "new" ? "Add New Case" : "Review Case"}
                </SheetTitle>
                <SheetDescription>
                  {mode === "new"
                    ? "Create a new utilization management review case"
                    : "Update case details and status for utilization management review"}
                </SheetDescription>
              </div>
              <div className="ml-4 flex gap-2">
                {mode === "review" && caseHistory && selectedCase && (
                  <CaseHistoryDialogClient
                    history={caseHistory}
                    currentCase={selectedCase}
                  />
                )}
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
                  disabled={
                    mode === "new"
                      ? !isValid || isPending
                      : !isDirty || isPending
                  }
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

          <div className="px-12">
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
                          onValueChange={(val) => {
                            handleClientChange();
                            field.onChange(val);
                          }}
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
                    <FieldLabel htmlFor="caseType">
                      Case Type <span className="text-destructive">*</span>
                      {tatDays !== null && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (TAT: {tatDays} days)
                        </span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="caseType"
                      control={control}
                      rules={{ required: "Case type is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="caseType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CaseTypes.map((type) => (
                              <SelectItem value={type} key={type}>
                                {CaseTypeLabels[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.caseType]} />
                  </Field>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <Field>
                    <FieldLabel htmlFor="recdDate">
                      Received Date <span className="text-destructive">*</span>
                      {dueDate && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (Due: {formatDueDate(dueDate)})
                        </span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="recdDate"
                      control={control}
                      rules={{ required: "Received date is required" }}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(toDate(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? toDate(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(formatDate({ date }));
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    <FormFieldError errors={[errors.recdDate]} />
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
                                (nurse) =>
                                  nurse.appAttrs?.type === "nurse" &&
                                  nurse.accountStatus === "ENABLED",
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
                            {CaseStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.status]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="closedDate">
                      Closed Date
                      {ClosedCaseStatuses.includes(status as CaseStatus) && (
                        <span className="text-destructive"> *</span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="closedDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(toDate(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? toDate(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(formatDate({ date }));
                                } else {
                                  field.onChange("");
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    <FormFieldError errors={[errors.closedDate]} />
                  </Field>
                </div>
              </div>

              <Separator />

              {/* Service Details Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Service Details
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      append({ code: "" });
                    }}
                    disabled={fields.length >= MAX_PROCEDURE_CODES}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Procedure Code
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {fields.map((field, index) => (
                    <Field key={field.id}>
                      <FieldLabel htmlFor={`procedureCode-${index}`}>
                        Procedure Code {index + 1}{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Controller
                          name={`procedureCodes.${index}.code`}
                          control={control}
                          rules={{ required: "Procedure code is required" }}
                          render={({ field }) => (
                            <ProcedureCodeInput
                              id={`procedureCode-${index}`}
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              placeholder="Enter code"
                              className="flex-1"
                            />
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => remove(index)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormFieldError
                        errors={[errors.procedureCodes?.[index]?.code]}
                      />
                    </Field>
                  ))}
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
                              setValue("physPubId", "");
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
                    <FieldLabel htmlFor="physPubId">
                      MD Name{" "}
                      {escalatedToMD === "Yes" && (
                        <span className="text-destructive">*</span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="physPubId"
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
                          <SelectTrigger id="physPubId">
                            <SelectValue placeholder="Select MD" />
                          </SelectTrigger>
                          <SelectContent>
                            {physicians.map((phys) => (
                              <SelectItem value={phys.pubId} key={phys.pubId}>
                                {phys.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.physPubId]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="mdRecommended">
                      MD Recommendation{" "}
                      {escalatedToMD === "Yes" &&
                        ClosedCaseStatuses.includes(status as CaseStatus) && (
                          <span className="text-destructive">*</span>
                        )}
                    </FieldLabel>
                    <Controller
                      name="mdRecommended"
                      control={control}
                      rules={{
                        required:
                          escalatedToMD === "Yes" &&
                          ClosedCaseStatuses.includes(status as CaseStatus)
                            ? "MD recommendation is required when escalated to MD and status is Approved, Denied, or Withdrawn"
                            : false,
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={escalatedToMD !== "Yes" || physPubId === ""}
                        >
                          <SelectTrigger id="mdRecommended">
                            <SelectValue placeholder="Select recommendation" />
                          </SelectTrigger>
                          <SelectContent>
                            {MDCaseRecommendations.map((recommendation) => (
                              <SelectItem
                                value={recommendation}
                                key={recommendation}
                              >
                                {recommendation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormFieldError errors={[errors.mdRecommended]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="followUpAction">
                      Follow Up Action
                      {mdRecommended === "Offer P2P" && (
                        <span className="text-destructive">*</span>
                      )}
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
                            {CaseFollowUpActions.map((caseFUAction) => (
                              <SelectItem
                                value={caseFUAction}
                                key={caseFUAction}
                              >
                                {caseFUAction}
                              </SelectItem>
                            ))}
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
                          disabled={mdRecommended !== "Offer P2P"}
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
                      placeholder={
                        mode === "new"
                          ? "Add any initial notes or comments..."
                          : "Add any additional notes or comments..."
                      }
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

  return sheetContent;
}
