"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, HeartPulse, Loader2 } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { cn } from "@workspace/ui/lib/utils";

import {
  ProcedureCodeValidation,
  validateProcedureCode,
} from "@/lib/validators/procedure-codes";

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
  const [isValidating, setIsValidating] = useState(false);
  const [showUmEvalDialog, setShowUmEvalDialog] = useState(false);

  // Debounce the input value
  const debouncedValue = useDebounce(value, 600);

  useEffect(() => {
    // Only validate if there's a value
    if (!debouncedValue || debouncedValue.trim() === "") {
      // Reset validation state asynchronously
      const resetValidation = async () => {
        setValidationState(null);
        setIsValidating(false);
        onValidationChange?.(null);
      };
      void resetValidation();
      return;
    }

    // Perform async validation
    const runValidation = async () => {
      setIsValidating(true);

      try {
        const result = await validateProcedureCode(debouncedValue);
        setValidationState(result);
        setIsValidating(false);
        onValidationChange?.(result);
      } catch (error) {
        console.error("[v0] Procedure code validation error:", error);
        const errorState = {
          isValid: false,
          requiresUmEval: false,
          error: "Validation service unavailable",
        };
        setValidationState(errorState);
        setIsValidating(false);
        onValidationChange?.(errorState);
      }
    };

    void runValidation();
  }, [debouncedValue, onValidationChange]);

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (!validationState) {
      return null;
    }

    if (!validationState.isValid) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }

    if (validationState.requiresUmEval) {
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

    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
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
              !validationState.isValid && "text-destructive",
              validationState.isValid &&
                !validationState.requiresUmEval &&
                "text-green-600",
              validationState.requiresUmEval && "text-amber-600",
            )}
          >
            {!validationState.isValid && "Invalid procedure code"}
            {validationState.isValid &&
              !validationState.requiresUmEval &&
              "Valid code"}
            {validationState.requiresUmEval && "Requires UM Evaluation Tool"}
          </p>
        )}
      </div>

      {validationState?.requiresUmEval && (
        <UmEvalToolDialog
          open={showUmEvalDialog}
          onOpenChange={setShowUmEvalDialog}
          procedureCode={value}
          codeDescription={validationState.description}
        />
      )}
    </>
  );
}