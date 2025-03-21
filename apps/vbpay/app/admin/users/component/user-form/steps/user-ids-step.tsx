"use client";

import { useFormContext } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { UserModeLabels, UserModes } from "@/types/user-mode";
import { UserRoleLabels, type UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { Icons } from "@/components/icons";

import { getRolesForUserType } from "../../../utils/get-roles-for-user-type";
import { UserFormData } from "../user-form-schema";

type props = {
  isSubmitting: boolean;
  physicians: ComboItem[];
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

export function UserIdsStep({
  isSubmitting,
  physicians,
  payers,
  practices,
  pos,
  facilities,
  vendors,
}: props) {
  const form = useFormContext<UserFormData>();
  const selectedType = form.getValues("type") as UserType;
  // Determine if multiple IDs are allowed based on user type
  const allowMultipleIds = selectedType === "bpo" || selectedType === "payers";

  // Add a new ID
  const addNewId = () => {
    const currentIds = form.getValues("ids");
    form.setValue("ids", [
      ...currentIds,
      {
        id: "",
        userMode: "aco",
        userRoles: ["view"],
      },
    ]);
  };

  // Remove an ID
  const removeId = (index: number) => {
    const currentIds = form.getValues("ids") || [];
    if (currentIds.length > 1) {
      form.setValue(
        "ids",
        currentIds.filter((_, i) => i !== index),
      );
    }
  };

  const typeToLabelMap = {
    bpo: "Payer",
    payers: "Payer",
    payer: "Payer",
    po: "Physician Org",
    physician: "Physician",
    vendor: "Vendor",
    practice: "Practice",
    facility: "Facility",
  };

  const labelForType = typeToLabelMap[selectedType] || "";

  const typeToItemsMap = {
    bpo: payers,
    payers: payers,
    payer: payers,
    po: pos,
    physician: physicians,
    vendor: vendors,
    practice: practices,
    facility: facilities,
  };

  const itemsForType = typeToItemsMap[selectedType] || [];

  const idsArray = form.getValues("ids") as Partial<UserFormData["ids"]>;
  const hasMultipleIds = idsArray.length > 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Entity Access & Roles</h2>
          <p className="text-muted-foreground">
            {allowMultipleIds
              ? `Add one or more ${labelForType.toLowerCase()}s and assign roles to each.`
              : `Add a ${labelForType.toLowerCase()} and assign roles.`}
          </p>
        </div>
        {(allowMultipleIds || idsArray.length === 0) && (
          <Button
            type="button"
            variant="outline"
            onClick={addNewId}
            disabled={isSubmitting}
          >
            <Icons.plus className="mr-2 h-4 w-4" />
            Add {labelForType}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {idsArray.map((_, index) => (
          <Card key={"id" + index} className="overflow-hidden">
            <CardContent className="p-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">ID #{index + 1}</h4>
                {allowMultipleIds && hasMultipleIds && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeId(index)}
                    disabled={isSubmitting}
                  >
                    <Icons.trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove {labelForType}</span>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormCombo
                  control={form.control}
                  name={`ids.${index}.id`}
                  label={labelForType}
                  comboItems={itemsForType}
                  isDisabled={isSubmitting}
                  isRequired
                />

                <FormField
                  control={form.control}
                  name={`ids.${index}.userMode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UserModes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {UserModeLabels[mode]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`ids.${index}.userRoles`}
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Roles</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getRolesForUserType(selectedType).map((role) => (
                        <FormField
                          key={role}
                          control={form.control}
                          name={`ids.${index}.userRoles`}
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={role}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role)}
                                    onCheckedChange={(checked) => {
                                      const currentRoles = field.value || [];
                                      return checked
                                        ? field.onChange([
                                            ...currentRoles,
                                            role,
                                          ])
                                        : field.onChange(
                                            currentRoles.filter(
                                              (v: UserRole) => v !== role,
                                            ),
                                          );
                                    }}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {
                                    UserRoleLabels[
                                      role as keyof typeof UserRoleLabels
                                    ]
                                  }
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
