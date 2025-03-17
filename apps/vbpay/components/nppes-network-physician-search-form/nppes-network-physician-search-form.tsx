"use client";

import { NPPES_STATES } from "@/values/nppes-state-values";
import { useForm } from "react-hook-form";

import { Form } from "@workspace/ui/components/form";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";

import { NppesNetworkPhysicianSearchFormInput } from "./nppes-network-physician-search-form-schema";

type props = {
  form: ReturnType<typeof useForm<NppesNetworkPhysicianSearchFormInput>>;
};

export function NppesNetworkPhysicianSearchForm({ form }: props) {
  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
        <FormInput
          control={form.control}
          name="npi"
          label="Individual NPI"
          type="text"
        />
        <FormInput
          control={form.control}
          name="lastName"
          label="Last Name"
          type="text"
        />
        <FormInput
          control={form.control}
          name="firstName"
          label="First Name"
          type="text"
        />
        <FormInput
          control={form.control}
          name="city"
          label="City"
          type="text"
        />
        <FormCombo
          control={form.control}
          name="state"
          label="State"
          comboItems={NPPES_STATES}
        />
        <FormInput control={form.control} name="zip" label="Zip" type="text" />
        <FormInput
          control={form.control}
          name="taxonomy"
          label="Taxonomy Desc"
          type="text"
        />
      </form>
    </Form>
  );
}
