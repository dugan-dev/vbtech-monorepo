"use client";

import { useEffect, useRef, useState } from "react";
import { validateProcedureCodeAction } from "@/actions/validate-procedure-code-action";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, HeartPulse, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { cn } from "@workspace/ui/lib/utils";

import type { ProcedureCodeValidation } from "@/lib/validators/procedure-codes";

import { UmEvalToolDialog } from "./eval-tool/um-eval-tool-dialog";

interface ProcedureCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (validation: ProcedureCodeValidation | null) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Renders a controlled procedure code input with debounced server validation, visual status indicators, and an optional UM Evaluation Tool dialog.
 *
 * @param value - Current input value for the procedure code.
 * @param onChange - Callback invoked with the new input value when the user types.
 * @param onValidationChange - Optional callback invoked with the latest validation result (`ProcedureCodeValidation | null`) whenever validation completes or is reset.
 * @param placeholder - Placeholder text shown when the input is empty (defaults to "Enter code").
 * @param className - Optional additional classes to apply to the input element.
 * @param id - Optional id attribute for the input element.
 * @returns A React element containing the procedure code input, validation icon and message, and the UM Evaluation Tool dialog when required.
 */
export function ProcedureCodeInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter code",
  className,
  id,
}: ProcedureCodeInputProps) {
  const [validationState, setValidationState] =
    useState<ProcedureCodeValidation | null>(null);
  const [showUmEvalDialog, setShowUmEvalDialog] = useState(false);

  // Store onValidationChange in a ref to avoid it being a dependency
  const onValidationChangeRef = useRef(onValidationChange);

  // Update the ref whenever the callback changes
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Debounce the input value
  const debouncedValue = useDebounce(value, 600);

  // Use React Query for client-side caching + server action calls
  const { data, isPending, error } = useQuery({
    queryKey: ["procedure-code-validation", debouncedValue],
    queryFn: async () => {
      if (!debouncedValue || debouncedValue.trim() === "") {
        return null;
      }
      const result = await validateProcedureCodeAction({
        code: debouncedValue,
      });
      return result;
    },
    enabled: !!debouncedValue && debouncedValue.trim() !== "",
    staleTime: 5 * 60 * 1000, // 5 minutes - procedure codes rarely change
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1, // Only retry once on failure
  });

  // Update validation state when query data or error changes
  useEffect(() => {
    // Branch 1: Empty input - clear validation
    if (!debouncedValue || debouncedValue.trim() === "") {
      setValidationState(null);
      onValidationChangeRef.current?.(null);
    }
    // Branch 2: Query error
    else if (error) {
      const errorState: ProcedureCodeValidation = {
        isValid: false,
        requiresUmEval: false,
        status: "invalid",
        message: "Validation service unavailable",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      setValidationState(errorState);
      onValidationChangeRef.current?.(errorState);
    }
    // Branch 3: Valid data returned
    else if (data?.data) {
      setValidationState(data.data);
      onValidationChangeRef.current?.(data.data);
    }
    // Branch 4: Query returned but no data (edge case to prevent stale state)
    else if (data !== undefined) {
      setValidationState(null);
      onValidationChangeRef.current?.(null);
    }
  }, [data, error, debouncedValue]);

  const getValidationIcon = () => {
    if (isPending) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (!validationState) {
      return null;
    }

    // Auto-approval: green checkmark
    if (validationState.status === "auto-approval") {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }

    // UM Eval Required: clickable amber heart pulse button
    if (validationState.status === "um-eval-required") {
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-amber-50"
          onClick={() => setShowUmEvalDialog(true)}
          title="Launch UM Evaluation Tool"
        >
          <HeartPulse className="h-4 w-4 text-amber-500" />
        </Button>
      );
    }

    // Not in scope: amber/orange alert
    if (validationState.status === "not-in-scope") {
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    }

    // Not listed or invalid: red alert
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <>
      <div className="space-y-1">
        <div className="relative">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn("font-mono pr-10", className)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        </div>
        {validationState && (
          <p
            className={cn(
              "text-xs",
              validationState.status === "auto-approval" && "text-green-600",
              validationState.status === "um-eval-required" && "text-amber-600",
              validationState.status === "not-in-scope" && "text-amber-600",
              validationState.status === "not-listed" && "text-destructive",
              validationState.status === "invalid" && "text-destructive",
            )}
          >
            {validationState.message}
          </p>
        )}
      </div>

      <UmEvalToolDialog
        open={showUmEvalDialog}
        onOpenChange={setShowUmEvalDialog}
        program={validationState?.data?.program}
        procedureCode={value}
        codeDescription={validationState?.description}
        ruleSet={validationState?.data?.ruleSet}
        ruleSubgroup={validationState?.data?.ruleSubgroup}
        ncd={validationState?.data?.ncd}
        lcd={validationState?.data?.lcd}
      />
    </>
  );
}
