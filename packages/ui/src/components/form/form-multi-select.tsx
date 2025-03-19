"use client";

import { Control } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { MultiSelect } from "@workspace/ui/components/multi-select";
import { ComboItem } from "@workspace/ui/types/combo-item";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  label: React.ReactNode;
  name: string;
  comboItems: ComboItem[];
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  infoHover?: React.ReactNode;
  className?: string;
  showFormMessageWithLabel?: boolean;
};

export function FormMultiSelect({
  control,
  label,
  name,
  comboItems,
  placeholder,
  isDisabled,
  isRequired,
  infoHover,
  showFormMessageWithLabel = false,
}: props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
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
          <MultiSelect
            items={comboItems}
            selected={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
          />
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
