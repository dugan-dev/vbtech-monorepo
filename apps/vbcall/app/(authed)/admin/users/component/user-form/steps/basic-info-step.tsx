"use client";

import { useFormContext } from "react-hook-form";

import { FormInput } from "@workspace/ui/components/form/form-input";

import { UserFormData } from "../user-form-schema";

type props = {
  isSubmitting: boolean;
};

export function BasicInfoStep({ isSubmitting }: props) {
  const form = useFormContext<UserFormData>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          {"Enter the user's personal information."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          type="text"
          control={form.control}
          name="firstName"
          label="First Name"
          isDisabled={isSubmitting}
          isRequired
        />

        <FormInput
          type="text"
          control={form.control}
          name="lastName"
          label="Last Name"
          isDisabled={isSubmitting}
          isRequired
        />
      </div>

      <FormInput
        type="email"
        control={form.control}
        name="email"
        label="Email"
        isDisabled={isSubmitting}
        isRequired
      />
    </div>
  );
}
