"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Control } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
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
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  infoHover?: React.ReactNode;
  showFormMessageWithLabel?: boolean;
  isDisabled?: boolean;
};

export function FormPasswordInput({
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
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={className}
                disabled={isDisabled}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isDisabled}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </FormControl>
          {!showFormMessageWithLabel && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
