"use client";

import { SETTINGS_GROUPS } from "@/values/global-settings-groups";
import { useFormContext } from "react-hook-form";

import { FormCheckboxList } from "@workspace/ui/components/form/form-checkbox-list";
import { FormSwitch } from "@workspace/ui/components/form/form-switch";

import { PayerTypeLabels, PayerTypes } from "@/types/payer-type";

import { SetupFormData } from "../setup-form-schema";

type props = {
  isSubmitting: boolean;
};

export function SetupStep3GlobalSettings({ isSubmitting }: props) {
  const { control } = useFormContext<SetupFormData>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Global Settings</h2>
        <p className="text-muted-foreground">
          Select the global settings to enable in the app.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
          <div className="flex flex-1 flex-col space-y-2">
            <div className="text-base font-semibold">
              Payer Types <span className="text-red-500">*</span>
            </div>
            <FormCheckboxList
              control={control}
              name="globalSettings.allowedPayerTypes"
              label="Payer Types"
              isRequired={false} // Set to false for UI purposes, the field is actually required in the schema as indicated above.
              items={PayerTypes.map((type) => ({
                label: PayerTypeLabels[type],
                value: type,
              }))}
              isDisabled={isSubmitting}
            />
          </div>
        </div>
        {SETTINGS_GROUPS.map((group) => (
          <div
            key={group.title}
            className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4"
          >
            <div className="flex flex-1 flex-col space-y-2">
              <div className="text-base font-semibold">{group.title}</div>
              {group.settings.map((setting) => (
                <FormSwitch
                  control={control}
                  name={`globalSettings.${setting.name}`} // Use dot notation to access the nested fieldsetting.name}
                  label={setting.label}
                  key={setting.name}
                  labelFirst
                  isDisabled={isSubmitting}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
