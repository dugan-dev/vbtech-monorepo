import * as z from "zod/v4";

const ClientFormSchema = z.object({
  clientName: z.string().min(1, "Required").max(255),
  clientCode: z.string().min(1, "Required").max(10),
  timezone: z.string().min(1, "Required").max(255),
  description: z.string().min(1, "Required").max(255),
});

type ClientFormData = z.infer<typeof ClientFormSchema>;
type ClientFormInput = z.input<typeof ClientFormSchema>;
type ClientFormOutput = z.output<typeof ClientFormSchema>;

const ClientFormDefaultValues: ClientFormInput = {
  clientName: "",
  clientCode: "",
  timezone: "",
  description: "",
};

export {
  ClientFormDefaultValues,
  ClientFormSchema,
  type ClientFormData,
  type ClientFormInput,
  type ClientFormOutput,
};
