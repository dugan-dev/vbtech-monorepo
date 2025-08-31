"use client";

import { CheckCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/components/form/form-input";
import { FormRadioGroup } from "@workspace/ui/components/form/form-radio-group";
import { Textarea } from "@workspace/ui/components/textarea";
import { formatPhoneNumber } from "@workspace/utils/format-phone-number";

import { useContactForm } from "../hooks/use-contact-form";

export function ContactForm() {
  const {
    isSubmitted,
    setIsSubmitted,
    handleReset,
    onSubmit,
    form,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    isPending,
  } = useContactForm();

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Thank You!</h3>
          <p className="text-muted-foreground">
            Your message has been received. One of our healthcare operations
            specialists will contact you shortly.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              handleReset();
            }}
            variant="outline"
            className="mt-4"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <ErrorDialog
        open={isErrorDialogOpen}
        title={errorTitle}
        description={errorMsg}
        onOpenChange={closeErrorDialog}
      />
      <h2 className="text-xl font-bold mb-2">Send Us a Message</h2>
      <p className="text-muted-foreground mb-6">
        {`Fill out the form below and we'll get back to you as soon as possible.`}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPending} className="space-y-4">
            {/* Organization - Full width */}
            <FormInput
              type="text"
              control={form.control}
              name="organization"
              label="Organization"
            />

            {/* First Name and Last Name - Side by side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                control={form.control}
                name="firstName"
                label="First name"
              />
              <FormInput
                type="text"
                control={form.control}
                name="lastName"
                label="Last name"
              />
            </div>

            {/* Email and Phone - Side by side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                type="email"
                control={form.control}
                name="email"
                label="Email"
              />
              <FormInput
                type="tel"
                control={form.control}
                name="phone"
                label="Phone number"
                formatOnChange={formatPhoneNumber}
              />
            </div>

            <FormRadioGroup
              control={form.control}
              name="serviceInterest"
              label="I'm interested in"
              items={[
                { value: "consulting", label: "Consulting Services" },
                { value: "tpa", label: "TPA Services" },
                { value: "bpaas", label: "BPaaS Solutions" },
                { value: "other", label: "Other" },
              ]}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about your healthcare operations needs..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleReset}
                disabled={isPending}
              >
                Reset Form
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
