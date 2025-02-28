import * as z from "zod";

const PasswordResetFormSchema = z.object({
  resetCode: z.string().min(1, "Required"),
  newPassword: z.string().min(1, "Required"),
  verifyPassword: z.string().min(1, "Required"),
});

type PasswordResetFormData = z.infer<typeof PasswordResetFormSchema>;
type PasswordResetFormInput = z.input<typeof PasswordResetFormSchema>;
type PasswordResetFormOutput = z.output<typeof PasswordResetFormSchema>;

const PasswordResetFormDefaultValues: PasswordResetFormInput = {
  resetCode: "",
  newPassword: "",
  verifyPassword: "",
};

export {
  PasswordResetFormSchema,
  PasswordResetFormDefaultValues,
  type PasswordResetFormData,
  type PasswordResetFormInput,
  type PasswordResetFormOutput,
};
