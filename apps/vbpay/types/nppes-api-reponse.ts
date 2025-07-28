import { z } from "zod/v4";

const NppesApiResponseResultSchema = z
  .object({
    created_epoch: z.coerce.number().nullable(),
    enumeration_type: z.string().nullable(),
    last_updated_epoch: z.coerce.number().nullable(),
    number: z.string().nullable(),
    addresses: z
      .array(
        z.object({
          country_code: z.string().optional().nullable(),
          country_name: z.string().optional().nullable(),
          address_purpose: z.string().optional().nullable(),
          address_type: z.string().optional().nullable(),
          address_1: z.string().optional().nullable(),
          address_2: z.string().optional().nullable(),
          city: z.string().optional().nullable(),
          state: z.string().optional().nullable(),
          postal_code: z.string().optional().nullable(),
          telephone_number: z.string().optional().nullable(),
          fax_number: z.string().optional().nullable(),
        }),
      )
      .optional(),
    practiceLocations: z
      .array(
        z.object({
          country_code: z.string().optional().nullable(),
          country_name: z.string().optional(),
          address_purpose: z.string().optional().nullable(),
          address_type: z.string().optional().nullable(),
          address_1: z.string().optional().nullable(),
          address_2: z.string().optional().nullable(),
          city: z.string().optional().nullable(),
          state: z.string().optional().nullable(),
          postal_code: z.string().optional().nullable(),
          telephone_number: z.string().optional().nullable(),
          fax_number: z.string().optional().nullable(),
        }),
      )
      .optional(),
    basic: z
      .object({
        enumeration_date: z.string().optional().nullable(),
        last_updated: z.string().optional().nullable(),
        certification_date: z.string().optional().nullable(),
        status: z.string().optional().nullable(),
        first_name: z.string().optional().nullable(),
        last_name: z.string().optional().nullable(),
        middle_name: z.string().optional().nullable(),
        credential: z.string().optional().nullable(),
        sole_proprietor: z.string().optional().nullable(),
        gender: z.string().optional().nullable(),
        name_prefix: z.string().optional().nullable(),
        name_suffix: z.string().optional().nullable(),
        organization_name: z.string().optional().nullable(),
        organizational_subpart: z.string().optional().nullable(),
        parent_org_lbn: z.string().optional().nullable(),
        parent_org_tin: z.string().optional().nullable(),
        authorized_official_first_name: z.string().optional().nullable(),
        authorized_official_last_name: z.string().optional().nullable(),
        authorized_official_telephone_number: z.string().optional().nullable(),
        authorized_official_title_or_position: z.string().optional().nullable(),
        authorized_official_name_prefix: z.string().optional().nullable(),
        authorized_official_name_suffix: z.string().optional().nullable(),
        authorized_official_credential: z.string().optional().nullable(),
      })
      .optional(),
    taxonomies: z
      .array(
        z.object({
          code: z.string().optional().nullable(),
          taxonomy_group: z.string().optional().nullable(),
          desc: z.string().optional().nullable(),
          state: z.string().optional().nullable(),
          license: z.string().optional().nullable(),
          primary: z.boolean().optional().nullable(),
        }),
      )
      .optional(),
    identifiers: z
      .array(
        z.object({
          code: z.string().optional().nullable(),
          desc: z.string().optional().nullable(),
          issuer: z.string().optional().nullable(),
          identifier: z.string().optional().nullable(),
          state: z.string().optional().nullable(),
        }),
      )
      .optional(),
    endpoints: z.array(z.unknown()).optional(),
    otherNames: z
      .array(
        z.object({
          organization_name: z.string().optional().nullable(),
          type: z.string().optional().nullable(),
          code: z.string().optional().nullable(),
        }),
      )
      .optional(),
  })
  .optional();

type NppesApiResponseResult = z.infer<typeof NppesApiResponseResultSchema>;

const NppesApiResponseSchema = z.object({
  result_count: z.number().optional().nullable(),
  results: NppesApiResponseResultSchema.array().optional().nullable(),
});

type NppesApiResponseFull = z.infer<typeof NppesApiResponseSchema>;

export {
  NppesApiResponseSchema,
  NppesApiResponseResultSchema,
  type NppesApiResponseResult,
  type NppesApiResponseFull,
};
