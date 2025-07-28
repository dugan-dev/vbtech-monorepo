import * as z from "zod/v4";

const EditPhysAffiliatesFormSchema = z
  .object({
    poNetEntPubId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    faclNetEntPubId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    pracNetEntPubId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    vendorNetEntPubId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    noAffiliates: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.noAffiliates === false &&
        !data.poNetEntPubId &&
        !data.faclNetEntPubId &&
        !data.pracNetEntPubId &&
        !data.vendorNetEntPubId
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Select at least one affiliate or check 'No Affiliates'.",
      path: ["noAffiliates"],
    },
  );

type EditPhysAffiliatesFormData = z.infer<typeof EditPhysAffiliatesFormSchema>;
type EditPhysAffiliatesFormInput = z.input<typeof EditPhysAffiliatesFormSchema>;
type EditPhysAffiliatesFormOutput = z.output<
  typeof EditPhysAffiliatesFormSchema
>;

const EditPhysAffiliatesFormDefaultValues: EditPhysAffiliatesFormInput = {
  poNetEntPubId: "",
  faclNetEntPubId: "",
  pracNetEntPubId: "",
  vendorNetEntPubId: "",
  noAffiliates: false,
};

export {
  EditPhysAffiliatesFormDefaultValues,
  EditPhysAffiliatesFormSchema,
  type EditPhysAffiliatesFormData,
  type EditPhysAffiliatesFormInput,
  type EditPhysAffiliatesFormOutput,
};
