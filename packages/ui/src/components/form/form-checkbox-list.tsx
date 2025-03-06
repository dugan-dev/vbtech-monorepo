import { Control } from "react-hook-form";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { ComboItem } from "@workspace/ui/types/combo-item";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  name: string;
  label: string;
  labelFirst?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  infoHover?: React.ReactNode;
  showFormMessageWithLabel?: boolean;
  isDisabled?: boolean;
  items: ComboItem[];
  uncheckAllWhenCheckedValue?: string;
};

export function FormCheckboxList({
  control,
  name,
  label,
  labelFirst,
  placeholder,
  isRequired,
  className,
  infoHover,
  showFormMessageWithLabel = false,
  isDisabled,
  items,
  uncheckAllWhenCheckedValue,
}: props) {
  return labelFirst ? (
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
          <FormDescription>{placeholder}</FormDescription>
          {items?.map((value) => (
            <FormField
              key={value.value + "formField"}
              control={control}
              name={value.value + "checkbox"}
              render={() => {
                return (
                  <FormItem
                    key={value.value + "formItem"}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormLabel className="text-sm font-normal">
                      {value.label}
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        name={name}
                        className={className}
                        disabled={isDisabled}
                        checked={field.value?.includes(value.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (value.value === uncheckAllWhenCheckedValue) {
                            // If uncheckAllWhenCheckedValue is selected, clear other selections
                            return checked
                              ? field.onChange([uncheckAllWhenCheckedValue])
                              : field.onChange([]);
                          } else {
                            // If another option is selected, remove uncheckAllWhenCheckedValue if present
                            const newValue = checked
                              ? [
                                  ...currentValue.filter(
                                    (v: string) =>
                                      v !== uncheckAllWhenCheckedValue,
                                  ),
                                  value.value,
                                ]
                              : currentValue.filter(
                                  (val: string) => val !== value.value,
                                );
                            field.onChange(newValue);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          ))}
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
          <FormDescription>{placeholder}</FormDescription>
          {items?.map((value) => (
            <FormField
              key={value.value + "formField"}
              control={control}
              name={value.value + "checkbox"}
              render={() => {
                return (
                  <FormItem
                    key={value.value + "formItem"}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        name={name}
                        disabled={isDisabled}
                        className={className}
                        checked={field.value?.includes(value.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (value.value === uncheckAllWhenCheckedValue) {
                            // If uncheckAllWhenCheckedValue is selected, clear other selections
                            return checked
                              ? field.onChange([uncheckAllWhenCheckedValue])
                              : field.onChange([]);
                          } else {
                            // If another option is selected, remove uncheckAllWhenCheckedValue if present
                            const newValue = checked
                              ? [
                                  ...currentValue.filter(
                                    (v: string) =>
                                      v !== uncheckAllWhenCheckedValue,
                                  ),
                                  value.value,
                                ]
                              : currentValue.filter(
                                  (val: string) => val !== value.value,
                                );
                            field.onChange(newValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {value.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
