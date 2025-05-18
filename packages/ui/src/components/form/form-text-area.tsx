import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

import { Textarea } from "../textarea";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  infoHover?: React.ReactNode;
  showFormMessageWithLabel?: boolean;
  isDisabled?: boolean;
};

export function FormTextarea({
  control,
  name,
  label,
  placeholder,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
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
            <Textarea
              placeholder={placeholder}
              className={className}
              disabled={isDisabled}
              {...field}
            />
          </FormControl>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
