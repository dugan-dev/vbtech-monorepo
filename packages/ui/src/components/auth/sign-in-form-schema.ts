import * as z from "zod";

const SignInFormSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  password: z.string().min(1, "Required"),
});

type SignInFormData = z.infer<typeof SignInFormSchema>;
type SignInFormInput = z.input<typeof SignInFormSchema>;
type SignInFormOutput = z.output<typeof SignInFormSchema>;

const SignInFormDefaultValues: SignInFormInput = {
  email: "",
  password: "",
};

export {
  SignInFormDefaultValues,
  SignInFormSchema,
  type SignInFormData,
  type SignInFormInput,
  type SignInFormOutput,
};
