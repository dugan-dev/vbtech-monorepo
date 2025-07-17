"use client";

import { AlertCircle, Building2, Stethoscope, Users } from "lucide-react";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import { FormCheckbox } from "@workspace/ui/components/form/form-checkbox";
import { FormCombo } from "@workspace/ui/components/form/form-combo";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormRadioGroup } from "@workspace/ui/components/form/form-radio-group";
import { FormSubmitButton } from "@workspace/ui/components/form/form-submit-button";
import { formatTaxId } from "@workspace/utils/format-tax-id";

import {
  NetworkPhysicianClasses,
  NetworkPhysicianClassLabels,
} from "@/types/network-physician-class";
import {
  NetworkPhysicianSpecialties,
  NetworkPhysicianSpecialty,
  NetworkPhysicianSpecialtyLabels,
} from "@/types/network-physician-specialty";
import {
  NetworkPhysicianType,
  NetworkPhysicianTypeLabels,
  NetworkPhysicianTypes,
} from "@/types/network-physician-type";
import {
  TaxonomyCode,
  TaxonomyCodeDefinitions,
  TaxonomyCodeDisplayNames,
  TaxonomyCodes,
} from "@/types/taxonomy-codes";

import { useAddNetworkPhysicianContext } from "../../contexts/use-add-network-physician-context";

export function AddNetworkPhysicianForm() {
  const {
    addNetworkPhysicianForm: form,
    isAddNetworkPhysicianFormSubmitting: isSubmitting,
    onSubmitAddNetworkPhysicianForm: onSubmit,
    currentStep,
    nextStep,
    prevStep,
    pos,
    practices,
    facilities,
    vendors,
  } = useAddNetworkPhysicianContext();
  const watchSoleProprietor = form.watch("physInfo.soleProprietor") as
    | "yes"
    | "no"
    | "";
  const watchType = form.watch("physInfo.type") as NetworkPhysicianType | "";
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting}>
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Physician Info
                </CardTitle>
                <CardDescription>
                  Enter the physician&apos;s information and compare with NPPES
                  data to verify.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <FormInput
                    control={form.control}
                    name="physInfo.lastName"
                    label="Last Name"
                    type="text"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    name="physInfo.firstName"
                    label="First Name"
                    type="text"
                    isRequired
                  />
                  <FormInput
                    control={form.control}
                    name="physInfo.npi"
                    label="Individual NPI"
                    type="text"
                    isRequired
                  />
                  <FormCombo
                    control={form.control}
                    name="physInfo.type"
                    label="Type"
                    isRequired
                    comboItems={NetworkPhysicianTypes.map((type) => ({
                      label: NetworkPhysicianTypeLabels[type],
                      value: type,
                    }))}
                  />
                  {(watchType === "fqhc individual" ||
                    watchType === "organizational provider") && (
                    <FormInput
                      control={form.control}
                      name="physInfo.orgNpi"
                      label="Organization NPI"
                      type="text"
                    />
                  )}
                  <FormCombo
                    control={form.control}
                    name="physInfo.class"
                    label="Class"
                    isRequired
                    comboItems={NetworkPhysicianClasses.map((type) => ({
                      label: NetworkPhysicianClassLabels[type],
                      value: type,
                    }))}
                  />
                  <FormRadioGroup
                    control={form.control}
                    name="physInfo.soleProprietor"
                    label="Sole Proprietor"
                    items={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    isHorizontal
                  />
                  <FormInput
                    control={form.control}
                    name="physInfo.taxId"
                    label="Tax ID"
                    type="text"
                    formatOnChange={formatTaxId}
                    isRequired={watchSoleProprietor === "yes"}
                  />
                  <FormCombo
                    control={form.control}
                    name="physInfo.primaryTaxonomyCode"
                    label="Primary Taxonomy"
                    comboItems={TaxonomyCodes.map((taxonomy) => ({
                      label: (
                        <span>
                          <strong>{`${TaxonomyCodeDisplayNames[taxonomy as TaxonomyCode]} (${taxonomy})`}</strong>
                          <br />
                          {TaxonomyCodeDefinitions[taxonomy as TaxonomyCode]}
                        </span>
                      ),
                      value: taxonomy,
                      selectionDisplay: `${TaxonomyCodeDisplayNames[taxonomy as TaxonomyCode]} (${taxonomy})`,
                    }))}
                  />
                  <FormCombo
                    control={form.control}
                    name="physInfo.specialty"
                    label="Specialty"
                    comboItems={NetworkPhysicianSpecialties.map(
                      (specialty) => ({
                        label:
                          NetworkPhysicianSpecialtyLabels[
                            specialty as NetworkPhysicianSpecialty
                          ],
                        value: specialty,
                      }),
                    )}
                  />
                  <FormInput
                    control={form.control}
                    name="physInfo.credential"
                    label="Credential"
                    type="text"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          {currentStep === 2 && (
            <div className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Organization Affiliations
                    </CardTitle>
                    <CardDescription>
                      Connect this physician to organizations and practices they
                      work with
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormCombo
                        control={form.control}
                        name="affInfo.poNetEntPubId"
                        label="Affiliate Physician Org"
                        comboItems={pos}
                      />
                      <FormCombo
                        control={form.control}
                        name="affInfo.pracNetEntPubId"
                        label="Affiliate Practice"
                        comboItems={practices}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Facility & Vendor Relations
                    </CardTitle>
                    <CardDescription>
                      Link to associated facilities and vendor relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormCombo
                        control={form.control}
                        name="affInfo.faclNetEntPubId"
                        label="Affiliate Facility"
                        comboItems={facilities}
                      />
                      <FormCombo
                        control={form.control}
                        name="affInfo.vendorNetEntPubId"
                        label="Affiliate Vendor"
                        comboItems={vendors}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-card flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    If this physician has no affiliations, check the box below.
                  </AlertDescription>
                </div>
                <FormCheckbox
                  control={form.control}
                  name="affInfo.noAffiliates"
                  label="No Affiliates"
                  itemClassName="space-x-2 justify-start"
                />
              </Alert>
            </div>
          )}
        </fieldset>
        <div className="border-t p-3 bg-background fixed bottom-0 left-0 right-0 shadow-lg">
          <div className="container max-w-screen-2xl mx-auto flex justify-end gap-4">
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} disabled={isSubmitting}>
                Previous
              </Button>
            )}
            {currentStep === 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <FormSubmitButton isSaving={isSubmitting} />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
