import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  name: string;
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  infoHover?: React.ReactNode;
  showFormMessageWithLabel?: boolean;
  isDisabled?: boolean;
  formatOnChange?: (value: string) => string;
};

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
