import {
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
  useRouter,
} from "next/navigation";
import { z } from "zod";

import { RouteBuilder } from "./makeRoute";

const emptySchema = z.object({});

type PushOptions = Parameters<ReturnType<typeof useRouter>["push"]>[1];

/**
 * Creates a navigation function that pushes a route constructed by the provided builder.
 *
 * This hook extracts the Next.js router's push method and returns a function that builds a route URL
 * using the supplied route parameters, optional search parameters, and navigation options. When invoked,
 * the returned function navigates to the constructed route.
 *
 * @param builder - A function that constructs a URL from given route parameters and optional search parameters.
 * @returns A function that, given route parameters, optional search parameters, and push options,
 * pushes the corresponding route to the Next.js router.
 */
export function usePush<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
>(builder: RouteBuilder<Params, Search>) {
  const { push } = useRouter();
  return (
    p: z.input<Params>,
    search?: z.input<Search>,
    options?: PushOptions,
  ) => {
    push(builder(p, search), options);
  };
}

/**
 * Validates and returns route parameters using the provided Zod schema.
 *
 * This hook retrieves the current route parameters via Next.js and validates them against the
 * parameters schema defined in the given route builder. If the validation fails, it throws an error
 * with a message that includes the route name and details about the validation error.
 *
 * @param builder - An object that includes the route name and a Zod schema for route parameters.
 * @returns The validated route parameters.
 *
 * @throws {Error} If the route parameters do not match the schema.
 */
export function useParams<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
>(builder: RouteBuilder<Params, Search>): z.output<Params> {
  const res = builder.paramsSchema.safeParse(useNextParams());
  if (!res.success) {
    throw new Error(
      `Invalid route params for route ${builder.routeName}: ${res.error.message}`,
    );
  }
  return res.data;
}

/**
 * Extracts and validates search parameters from the URL.
 *
 * This hook converts the current URL's search parameters into a plain object and validates them using the search schema defined in the provided route builder.
 * If the search parameters do not conform to the expected schema, an error with details about the invalid parameters is thrown.
 *
 * @param builder - An object that defines the search schema and route metadata.
 * @returns The validated search parameters.
 *
 * @throws Error if the search parameters fail validation.
 */
export function useSearchParams<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
>(builder: RouteBuilder<Params, Search>): z.output<Search> {
  const res = builder.searchSchema!.safeParse(
    convertURLSearchParamsToObject(useNextSearchParams()),
  );
  if (!res.success) {
    throw new Error(
      `Invalid search params for route ${builder.routeName}: ${res.error.message}`,
    );
  }
  return res.data;
}

/**
 * Converts a URLSearchParams object to a plain object.
 *
 * This function iterates through the provided URLSearchParams and constructs an object where each key
 * is associated with its corresponding value. If a key has multiple values, those values are returned as an array.
 * If the input is null, an empty object is returned.
 *
 * @param params - A URLSearchParams object or null.
 * @returns An object mapping search parameter keys to their string value or array of string values.
 */
function convertURLSearchParamsToObject(
  params: Readonly<URLSearchParams> | null,
): Record<string, string | string[]> {
  if (!params) {
    return {};
  }

  const obj: Record<string, string | string[]> = {};
  // @ts-ignore
  for (const [key, value] of params.entries()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
