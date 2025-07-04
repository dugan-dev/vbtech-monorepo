"use client";

import { Building2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { formatTaxId } from "@workspace/ui/lib/formatTaxId";

import {
  NetworkEntityTypeLabels,
  NetworkEntityTypes,
} from "@/types/network-entity-type";

import { useAddNetworkEntityContext } from "../../contexts/add-network-entity-context";

export function AddNetworkEntityForm() {
  const {
    addNetworkEntityForm: form,
    isAddNetworkEntityFormSubmitting: isSubmitting,
    onSubmitAddNetworkEntityForm: onSubmit,
  } = useAddNetworkEntityContext();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Entity Info
              </CardTitle>
              <CardDescription>
                Enter the entity&apos;s information and compare with NPPES data
                to verify.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <FormCombo
                  control={form.control}
                  name="netEntType"
                  label="Entity Type"
                  isRequired
                  comboItems={NetworkEntityTypes.map((type) => ({
                    label: NetworkEntityTypeLabels[type],
                    value: type,
                  }))}
                />
                <FormInput
                  control={form.control}
                  name="marketingName"
                  label="Marketing Name"
                  type="text"
                  isRequired
                />
                <FormInput
                  control={form.control}
                  name="legalName"
                  label="Legal Name"
                  type="text"
                />
                <FormInput
                  control={form.control}
                  name="referenceName"
                  label="Acronym/Nickname"
                  type="text"
                />
                <FormInput
                  control={form.control}
                  name="orgNpi"
                  label="Organizational NPI"
                  type="text"
                />
                <FormInput
                  control={form.control}
                  name="taxId"
                  label="Tax ID"
                  type="text"
                  formatOnChange={formatTaxId}
                />
              </div>
            </CardContent>
          </Card>
        </fieldset>
        <div className="border-t p-3 bg-background fixed bottom-0 left-0 right-0 shadow-lg">
          <div className="container max-w-screen-2xl mx-auto flex justify-end gap-4">
            <FormSubmitButton isSaving={isSubmitting} />
          </div>
        </div>
      </form>
    </Form>
  );
}
