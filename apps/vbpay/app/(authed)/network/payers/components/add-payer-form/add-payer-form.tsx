"use client";

import { useSettingsContext } from "@/contexts/settings-context";
import { settingsToAllowedPayerTypesCombo } from "@/utils/settings-to-allowed-payer-types-combo";

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
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { formatTaxId } from "@workspace/ui/lib/formatTaxId";

import { PerfMonthLabels, PerfMonths } from "@/types/perf-month";
import { PerfYears } from "@/types/perf-year";
import { ErrorDialog } from "@/components/error-dialog";

import { useAddPayerForm } from "../../hooks/use-add-payer-form";

type props = {
  onSuccess?: () => void;
};

/**
 * Displays a multi-section form for adding a new payer, including fields for basic information, performance period, identification, and organization details.
 *
 * @param onSuccess - Optional callback invoked after a payer is successfully added.
 *
 * @remark
 * The form is disabled and shows a saving state during submission. Any errors encountered during submission are presented in a dialog.
 */
export function AddPayerForm({ onSuccess }: props) {
  const settings = useSettingsContext();
  const payerTypes = settingsToAllowedPayerTypesCombo(settings);
  const {
    form,
    onSubmit,
    isInsertPayerPending,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
  } = useAddPayerForm({
    onSuccess,
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="container max-w-screen-lg mx-auto px-6 py-8">
        <Form {...form}>
          <ErrorDialog
            open={isErrorDialogOpen}
            onOpenChange={closeErrorDialog}
            description={errorMsg}
            title={errorTitle}
          />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
              <fieldset
                disabled={isInsertPayerPending}
                className="space-y-4 mb-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Basic Info
                      </CardTitle>
                      <CardDescription>
                        Enter basic payer information below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCombo
                        control={form.control}
                        name="payerType"
                        label="Payer Type"
                        isRequired
                        comboItems={payerTypes}
                      />
                      <FormInput
                        control={form.control}
                        name="marketingName"
                        label="Marketing Name"
                        type="text"
                        isRequired
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Performance Period
                      </CardTitle>
                      <CardDescription>
                        Enter initial performance period information below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCombo
                        control={form.control}
                        name="initPerfYr"
                        label="Initial Performance Year"
                        isRequired
                        comboItems={PerfYears.map((py) => ({
                          label: py,
                          value: py,
                        }))}
                      />
                      <FormCombo
                        control={form.control}
                        name="initPerfMo"
                        label="Initial Performance Month"
                        isRequired
                        comboItems={PerfMonths.map((pm) => ({
                          label: PerfMonthLabels[pm],
                          value: pm,
                        }))}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Identification
                      </CardTitle>
                      <CardDescription>
                        Enter payer identification information below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInput
                        control={form.control}
                        name="cmsId"
                        label="CMS ID"
                        type="text"
                      />
                      <FormInput
                        control={form.control}
                        name="taxId"
                        label="Tax ID"
                        type="text"
                        formatOnChange={(value) => formatTaxId(value)}
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
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Organization
                      </CardTitle>
                      <CardDescription>
                        Enter organization information below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormInput
                        control={form.control}
                        name="parentOrgName"
                        label="Parent Organization Name"
                        type="text"
                      />
                      <FormInput
                        control={form.control}
                        name="websiteUrl"
                        label="Website URL"
                        type="text"
                      />
                    </CardContent>
                  </Card>
                </div>
              </fieldset>
              <div className="flex pt-4 border-t justify-end">
                <FormSubmitButton isSaving={isInsertPayerPending} />
              </div>
            </ScrollArea>
          </form>
        </Form>
      </div>
    </div>
  );
}
