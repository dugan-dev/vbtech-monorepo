import { Control } from "react-hook-form";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  name: string;
  label: string;
  isRequired?: boolean;
  className?: string;
  infoHover?: React.ReactNode;
  showFormMessageWithLabel?: boolean;
  isDisabled?: boolean;
  labelFirst?: boolean;
  itemClassName?: string;
};

export function FormCheckbox({
  control,
  name,
  label,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
  labelFirst,
  itemClassName,
}: props) {
  return labelFirst ? (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              "flex flex-row items-center justify-between space-y-0",
              itemClassName,
            )}
          >
            <FormLabel>
              {label}
              {isRequired && (
                <span className="text-md ms-2 font-extrabold text-red-600">
                  *
                </span>
              )}
              {infoHover && infoHover}
              {showFormMessageWithLabel && <FormMessage />}
            </FormLabel>
            <FormControl>
              <Checkbox
                disabled={isDisabled}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={className}
              />
            </FormControl>
          </div>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  ) : (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div
            className={cn(
              "flex flex-row items-center justify-between space-y-0",
              itemClassName,
            )}
          >
            <FormControl>
              <Checkbox
                disabled={isDisabled}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={className}
              />
            </FormControl>
            <FormLabel>
              {label}
              {isRequired && (
                <span className="text-md ms-2 font-extrabold text-red-600">
                  *
                </span>
              )}
              {infoHover && infoHover}
              {showFormMessageWithLabel && <FormMessage />}
            </FormLabel>
          </div>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
