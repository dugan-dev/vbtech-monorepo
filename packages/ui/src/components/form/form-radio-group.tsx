import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";
import { ComboItem } from "@workspace/ui/types/combo-item";

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
  items: ComboItem[];
  isHorizontal?: boolean;
  classNameContent?: string;
};

export function FormRadioGroup({
  control,
  name,
  label,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
  items,
  isHorizontal,
  classNameContent,
}: props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
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
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isDisabled}
              className={
                isHorizontal
                  ? cn("flex flex-row space-x-1", classNameContent)
                  : cn("flex flex-col space-y-1", classNameContent)
              }
              value={field.value}
              name={name}
            >
              {items?.map((value) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={value.value + "formItem"}
                >
                  <FormControl key={value.value + "formControl"}>
                    <RadioGroupItem
                      value={value.value as string}
                      key={value.value + "radioGroupItem"}
                      disabled={isDisabled}
                      id={"radioGroupItem" + value.value}
                      className={className}
                    />
                  </FormControl>
                  <FormLabel
                    className="font-normal"
                    key={value.value + "formLabel"}
                    htmlFor={"radioGroupItem" + value.value}
                  >
                    {value.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
