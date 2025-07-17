import { useFormContext } from "react-hook-form";

import { FormInput } from "@workspace/ui/components/form/form-input";
import { formatPhoneNumber } from "@workspace/utils/format-phone-number";

import { HealthPlanFormData } from "./health-plan-form-schema";

/**
 * Renders the basic information step of a health plan form, including fields for plan name, plan ID, PX phone number, and fax number.
 *
 * @returns A React component displaying input fields for entering basic health plan details.
 */
export function HealthPlanFormBasicInfoStep() {
  const form = useFormContext<HealthPlanFormData>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">
          {"Enter the basic health plan information."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          control={form.control}
          name="planName"
          label="Health Plan Name"
          type="text"
          isRequired
        />
        <FormInput
          control={form.control}
          name="planId"
          label="Health Plan ID"
          type="text"
          isRequired
        />
        <FormInput
          control={form.control}
          name="phoneNumber"
          label="Health Plans PX Phone Number"
          type="tel"
          formatOnChange={(value) => formatPhoneNumber(value)}
          isRequired
        />
        <FormInput
          control={form.control}
          name="faxNumber"
          label="Health Plan's Fax Number"
          type="tel"
          formatOnChange={(value) => formatPhoneNumber(value)}
          isRequired
        />
      </div>
    </div>
  );
}
