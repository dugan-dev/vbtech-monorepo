import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

/**
 * Props for the FormInput component.
 */
type props = {
  /** React Hook Form control object for form state management */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  /** Field name for form registration and validation */
  name: string;
  /** Label text displayed above the input */
  label: string;
  /** HTML input type attribute */
  type: React.HTMLInputTypeAttribute;
  /** Optional placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required (adds red asterisk) */
  isRequired?: boolean;
  /** Additional CSS classes for styling */
  className?: string;
  /** Optional hover tooltip or info icon */
  infoHover?: React.ReactNode;
  /** Whether to show form message next to the label instead of below input */
  showFormMessageWithLabel?: boolean;
  /** Whether the input is disabled */
  isDisabled?: boolean;
  /** Optional function to format the input value on change */
  formatOnChange?: (value: string) => string;
};

/**
 * A form input component that integrates with React Hook Form.
 *
 * This component provides a complete form field with label, input, validation,
 * and error handling. It automatically integrates with React Hook Form's
 * validation and state management system.
 *
 * @param props - Configuration object containing form control, field metadata, and styling options
 * @returns FormInput component with integrated form validation and error handling
 */
export function FormInput({
  control,
  name,
  label,
  placeholder,
  type,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
  formatOnChange,
}: props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <div className="flex items-center">
              {label}
              {isRequired && (
                <span className="text-md ms-2 font-extrabold text-red-600">
                  *
                </span>
              )}
              {infoHover && infoHover}
              {showFormMessageWithLabel && <FormMessage />}
            </div>
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className={className}
              disabled={isDisabled}
              onChange={(e) => {
                field.onChange(
                  formatOnChange?.(e.target.value) ?? e.target.value,
                );
              }}
              value={field.value ?? ""}
            />
          </FormControl>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
