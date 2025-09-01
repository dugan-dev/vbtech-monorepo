"use server";

import "server-only";

import { env } from "@/env/server";
import { Resend } from "resend";
import { z } from "zod";

import { safeActionClient } from "@/lib/safe-action";

import { ContactFormEmail } from "../components/contact-form-email";
import { ContactFormSchema } from "../components/contact-form-schema";

const schema = z.object({
  formData: ContactFormSchema,
});

export const handleContactFormSubmissionAction = safeActionClient
  .metadata({
    actionName: "handleContactFormSubmissionAction",
  })
  .schema(schema)
  .action(async ({ parsedInput: { formData } }) => {
    try {
      // Initialize Resend
      const resend = new Resend(env.RESEND_API_KEY);

      // Send email notification using Resend
      const { error } = await resend.emails.send({
        from: "Value Based Tech <no-reply@web.valuebasedtech.com>",
        to: [
          "tdugan@valuebasedtech.com",
          "jyap@valuebasedtech.com",
          "contact@valuebasedtech.com",
        ],
        subject: `New Website Contact Form Submission from ${formData.organization}`,
        replyTo: formData.email,
        react: ContactFormEmail({
          formData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            organization: formData.organization,
            phone: formData.phone,
            serviceInterest: formData.serviceInterest,
            message: formData.message,
          },
        }),
      });

      // Handle Resend API errors
      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          message: "Failed to send email notification. Please try again.",
        };
      }

      return {
        success: true,
        message: "Thank you for your message. We'll be in touch shortly.",
      };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message };
    }
  });
