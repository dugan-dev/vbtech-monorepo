"use client";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { UserType, UserTypeLabels, UserTypes } from "@/types/user-type";

import { UserFormData } from "../user-form-schema";

type props = {
  isSubmitting: boolean;
  selectedType: UserType;
};

export function UserTypeStep({ isSubmitting, selectedType }: props) {
  const form = useFormContext<UserFormData>();
  const canShowAdminAndSuperGlobals =
    selectedType === "bpo" ||
    selectedType === "payers" ||
    selectedType === "payer";
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Type & Permissions</h2>
        <p className="text-muted-foreground">
          Select the user type and assign global roles.
        </p>
      </div>

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {UserTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {UserTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              User type determines page level access ande the available global
              and entity level roles.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {canShowAdminAndSuperGlobals && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField
            control={form.control}
            name="admin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Admin</FormLabel>
                  <FormDescription>User has global admin role</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="super"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Super User</FormLabel>
                  <FormDescription>
                    User has global super user role
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
