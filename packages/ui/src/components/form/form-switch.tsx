import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Switch } from "@workspace/ui/components/switch";

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
};

export function FormSwitch({
  control,
  name,
  label,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
  labelFirst,
}: props) {
  return labelFirst ? (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-y-0">
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
            <Switch
              disabled={isDisabled}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={className}
            />
          </FormControl>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  ) : (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-y-0">
          <FormControl>
            <Switch
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
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
