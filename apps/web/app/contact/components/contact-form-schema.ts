import { z } from "zod";

export const ContactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  organization: z
    .string()
    .min(2, { message: "Organization name is required." }),
  phone: z.string().optional(),
  serviceInterest: z.enum(["consulting", "tpa", "tech", "other"], {
    required_error: "Please select a service you're interested in.",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
