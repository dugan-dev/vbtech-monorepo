import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSwitch } from "@workspace/ui/components/form/form-switch";

import { Icons } from "@/components/icons";

import { HealthPlanFormData } from "./health-plan-form-schema";

export function HealthPlanFormPBPsStep() {
  const form = useFormContext<HealthPlanFormData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pbps",
  });
  const addPbp = () => {
    append({ pbpId: "", pbpName: "", isActive: true, pbpPubId: "" });
  };
  const removePbp = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Plan Benefit Packages</h2>
        <p className="text-muted-foreground">
          {
            "Enter the PBP(s) for this health plan. At least one PBP is required."
          }
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  type="text"
                  control={form.control}
                  label="PBP ID"
                  name={`pbps.${index}.pbpId`}
                  isRequired
                  isDisabled={
                    form.getValues(`pbps.${index}.isActive`) === false
                  }
                />

                <FormInput
                  type="text"
                  control={form.control}
                  label="PBP Name"
                  name={`pbps.${index}.pbpName`}
                  isRequired
                  isDisabled={
                    form.getValues(`pbps.${index}.isActive`) === false
                  }
                />
              </div>

              {fields.length > 1 && field.pbpPubId === "" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                  onClick={() => removePbp(index)}
                >
                  <Icons.trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove PBP</span>
                </Button>
              )}

              {field.pbpPubId !== "" &&
                field.pbpPubId !== undefined &&
                field.pbpPubId !== null && (
                  <div className="absolute top-4 right-4 ">
                    <FormSwitch
                      control={form.control}
                      label="Active"
                      name={`pbps.${index}.isActive`}
                      labelFirst
                    />
                  </div>
                )}
            </CardContent>
          </Card>
        ))}

        {form.formState.errors.pbps &&
          typeof form.formState.errors.pbps.message === "string" && (
            <p className="text-sm text-destructive">
              {form.formState.errors.pbps.message}
            </p>
          )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addPbp}
        className="w-full"
      >
        <Icons.plus className="h-4 w-4 mr-2" />
        Add Another PBP
      </Button>
    </div>
  );
}
