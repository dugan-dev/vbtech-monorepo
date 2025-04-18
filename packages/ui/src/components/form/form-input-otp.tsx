import { useEffect, useRef } from "react";
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

type props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  name: string;
  label: string;
};

export function FormInputOtp({ control, name, label }: props) {
  // Reference to the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the first input slot when component mounts
  useEffect(() => {
    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      // Find the first input element in the OTP group
      if (containerRef.current) {
        const inputElement = containerRef.current.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2 items-center">
          <FormLabel>
            <div className="flex items-center">{label}</div>
          </FormLabel>
          <FormControl>
            <div ref={containerRef}>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
