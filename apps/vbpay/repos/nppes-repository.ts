import {
  NPPES_API_VERSION,
  NPPES_BASE_API_URL,
  NPPES_ENUMERATION_TYPE_INDIVIDUAL,
  NPPES_ENUMERATION_TYPE_ORGANIZATION,
} from "@/values/nppes-api-values";

import {
  NppesApiResponseFull,
  NppesApiResponseSchema,
} from "@/types/nppes-api-reponse";
import { TaxonomyCode, TaxonomyCodeSpecialties } from "@/types/taxonomy-codes";

import "server-only";

import { z } from "zod";

const NppesSearchParamsSchema = z.object({
  npiType: z.literal("individual").or(z.literal("organization")),
  npi: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  taxonomy: z.string().optional(),
});

type NppesSearchParams = z.infer<typeof NppesSearchParamsSchema>;

const RESULTS_LIMIT = "200";

class NppesApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NppesApiError";
  }
}

function getEnumerationType(npiType: "individual" | "organization"): string {
  return npiType === "individual"
    ? NPPES_ENUMERATION_TYPE_INDIVIDUAL
    : NPPES_ENUMERATION_TYPE_ORGANIZATION;
}

function appendSearchParam(
  url: URL,
  key: string,
  value?: string,
  addWildcard = true,
): void {
  if (!value) return;
  const formattedValue = addWildcard ? `${value}*` : value;
  url.searchParams.append(key, formattedValue);
}

function buildNppesApiUrl(
  params: NppesSearchParams,
  useWildcards = false,
): URL {
  const url = new URL(NPPES_BASE_API_URL);

  // Required parameters
  url.searchParams.append(
    "enumeration_type",
    getEnumerationType(params.npiType),
  );
  url.searchParams.append("version", NPPES_API_VERSION);
  url.searchParams.append("limit", RESULTS_LIMIT);

  // Optional parameters with wildcards
  appendSearchParam(url, "number", params.npi, false);
  appendSearchParam(
    url,
    "first_name",
    params.firstName,
    params.firstName !== "" && useWildcards,
  );
  appendSearchParam(
    url,
    "last_name",
    params.lastName,
    params.lastName !== "" && useWildcards,
  );
  appendSearchParam(
    url,
    "organization_name",
    params.orgName,
    params.orgName !== "" && useWildcards,
  );
  appendSearchParam(
    url,
    "city",
    params.city,
    params.city !== "" && useWildcards,
  );
  appendSearchParam(url, "state", params.state, false);
  appendSearchParam(url, "postal_code", params.zip);
  appendSearchParam(
    url,
    "taxonomy_description",
    params.taxonomy
      ? TaxonomyCodeSpecialties[params.taxonomy as TaxonomyCode]
      : undefined,
  );

  return url;
}

async function fetchAndValidateResponse(
  url: URL,
): Promise<NppesApiResponseFull> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new NppesApiError(
        `API request failed with status: ${response.status}`,
      );
    }

    const data = await response.json();
    const parsedData = NppesApiResponseSchema.safeParse(data);

    if (!parsedData.success) {
      throw new NppesApiError(
        `Response validation failed: ${parsedData.error.message}`,
      );
    }

    return parsedData.data;
  } catch (error) {
    if (error instanceof NppesApiError) {
      throw error;
    }
    throw new NppesApiError(
      `Failed to fetch NPPES data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function fetchNppesApiResponse(
  params: NppesSearchParams,
): Promise<NppesApiResponseFull> {
  const url = buildNppesApiUrl(params);
  const resp = await fetchAndValidateResponse(url);

  if (
    resp.results === undefined ||
    resp.results === null ||
    resp.results.length === 0
  ) {
    return await fetchAndValidateResponse(buildNppesApiUrl(params, true));
  } else {
    return resp;
  }
}

export {
  fetchNppesApiResponse,
  NppesSearchParamsSchema,
  type NppesSearchParams,
};
