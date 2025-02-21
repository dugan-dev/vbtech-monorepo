/*
Derived from: https://www.flightcontrol.dev/blog/fix-nextjs-routing-to-have-full-type-safety
*/
import Link from "next/link";
import queryString from "query-string";
import { z } from "zod";

type LinkProps = Parameters<typeof Link>[0];

export type RouteInfo<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
> = {
  name: string;
  params: Params;
  search: Search;
  description?: string;
};

export type GetInfo<Result extends z.ZodSchema> = {
  result: Result;
};

export type PostInfo<Body extends z.ZodSchema, Result extends z.ZodSchema> = {
  body: Body;
  result: Result;
  description?: string;
};

export type PutInfo<Body extends z.ZodSchema, Result extends z.ZodSchema> = {
  body: Body;
  result: Result;
  description?: string;
};

type FetchOptions = Parameters<typeof fetch>[1];

type CoreRouteElements<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
> = {
  params: z.output<Params>;
  paramsSchema: Params;
  search: z.output<Search>;
  searchSchema: Search;
};

type PutRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  body: z.output<Body>;
  bodySchema: Body;
  result: z.output<Result>;
  resultSchema: Result;
};

type PostRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  body: z.output<Body>;
  bodySchema: Body;
  result: z.output<Result>;
  resultSchema: Result;
};

type GetRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Result extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>>;

  result: z.output<Result>;
  resultSchema: Result;
};

type DeleteRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
> = CoreRouteElements<Params, z.ZodSchema> & {
  (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<void>;
};

export type RouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
> = CoreRouteElements<Params, Search> & {
  (p?: z.input<Params>, search?: z.input<Search>): string;

  routeName: string;

  Link: React.FC<
    Omit<LinkProps, "href"> &
      z.input<Params> & {
        search?: z.input<Search>;
      } & { children?: React.ReactNode }
  >;
  ParamsLink: React.FC<
    Omit<LinkProps, "href"> & {
      params?: z.input<Params>;
      search?: z.input<Search>;
    } & { children?: React.ReactNode }
  >;
};

/**
 * Constructs a URL path builder from a dynamic route pattern.
 *
 * This function parses a route pattern that may include dynamic segments (e.g. "[id]"),
 * catch-all segments (e.g. "[...slug]"), and optional catch-all segments (e.g. "[[...slug]]").
 * It returns a builder function that takes an object of parameters and generates a URL path
 * by replacing the dynamic placeholders with the corresponding values.
 *
 * @param route - The route pattern string containing dynamic or catch-all segments.
 * @returns A function that accepts parameter values and returns the constructed URL path.
 */
function createPathBuilder<T extends Record<string, string | string[]>>(
  route: string,
): (params: T) => string {
  const pathArr = route.split("/");

  let catchAllSegment: ((params: T) => string) | null = null;
  if (pathArr.at(-1)?.startsWith("[[...")) {
    const catchKey = pathArr.pop()!.replace("[[...", "").replace("]]", "");
    catchAllSegment = (params: T) => {
      const catchAll = params[catchKey] as unknown as string[];
      return catchAll ? `/${catchAll.join("/")}` : "";
    };
  }

  const elems: ((params: T) => string)[] = [];
  for (const elem of pathArr) {
    const catchAll = elem.match(/\[\.\.\.(.*)\]/);
    const param = elem.match(/\[(.*)\]/);
    if (catchAll?.[1]) {
      const key = catchAll[1];
      elems.push((params: T) =>
        (params[key as unknown as string] as string[]).join("/"),
      );
    } else if (param?.[1]) {
      const key = param[1];
      elems.push((params: T) => params[key as unknown as string] as string);
    } else if (!(elem.startsWith("(") && elem.endsWith(")"))) {
      elems.push(() => elem);
    }
  }

  return (params: T): string => {
    const p = elems
      .map((e) => e(params))
      .filter(Boolean)
      .join("/");
    if (catchAllSegment) {
      return p + catchAllSegment(params);
    } else {
      return p.length ? p : "/";
    }
  };
}

/**
 * Creates a route builder function that validates and constructs a URL from a route template.
 *
 * This function returns a builder that accepts optional route parameters and search queries. The inputs are validated
 * against the provided Zod schemas in the route metadata. If validation fails, an error is thrown with details about 
 * the invalid input; otherwise, the builder returns a URL string with dynamic segments replaced and an appended query string 
 * if search parameters are provided.
 *
 * @param route - A URL template that may include dynamic segments.
 * @param info - Route metadata including a unique name and optional Zod schemas for validating route parameters and search queries.
 * @returns A function that takes optional route parameters and search queries, validates them, and returns a constructed URL string.
 */
function createRouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
>(route: string, info: RouteInfo<Params, Search>) {
  const fn = createPathBuilder<z.output<Params>>(route);

  return (params?: z.input<Params>, search?: z.input<Search>) => {
    let checkedParams = params || {};
    if (info.params) {
      const safeParams = info.params.safeParse(checkedParams);
      if (!safeParams?.success) {
        throw new Error(
          `Invalid params for route ${info.name}: ${safeParams.error.message}`,
        );
      } else {
        checkedParams = safeParams.data;
      }
    }
    const safeSearch = info.search
      ? info.search?.safeParse(search || {})
      : null;
    if (info.search && !safeSearch?.success) {
      throw new Error(
        `Invalid search params for route ${info.name}: ${safeSearch?.error.message}`,
      );
    }

    const baseUrl = fn(checkedParams);
    const searchString = search && queryString.stringify(search);
    return [baseUrl, searchString ? `?${searchString}` : ""].join("");
  };
}

const emptySchema = z.object({});

/**
 * Constructs a POST route builder with integrated schema validation.
 *
 * This function returns a route builder that validates the provided request body against a specified schema,
 * constructs a URL using dynamic route parameters and search queries, and performs an HTTP POST request. The response
 * is then validated against the expected result schema. Errors are thrown if the request body or response fails validation
 * or if the fetch operation is unsuccessful.
 *
 * @param route - The URL pattern defining the endpoint.
 * @param info - Route information including the route name and schemas for parameters and search queries.
 * @param postInfo - Contains the schemas for validating the request body and the expected response.
 *
 * @returns A POST route builder function for executing type-safe POST requests.
 */
export function makePostRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  postInfo: PostInfo<Body, Result>,
): PostRouteBuilder<Params, Search, Body, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: PostRouteBuilder<Params, Search, Body, Result> = (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    const safeBody = postInfo.body.safeParse(body);
    if (!safeBody.success) {
      throw new Error(
        `Invalid body for route ${info.name}: ${safeBody.error.message}`,
      );
    }

    return fetch(urlBuilder(p, search), {
      ...options,
      method: "POST",
      body: JSON.stringify(safeBody.data),
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = postInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(
            `Invalid response for route ${info.name}: ${result.error.message}`,
          );
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.body = undefined as z.output<Body>;
  routeBuilder.bodySchema = postInfo.body;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = postInfo.result;

  return routeBuilder;
}

/**
 * Creates a PUT route builder that validates both the request body and the response.
 *
 * The returned function validates the provided request body using a zod schema before executing a PUT request
 * to a URL constructed from the given route information. After the request, it validates the JSON response against
 * the expected result schema. If any validation fails or the HTTP response is unsuccessful, an error is thrown.
 *
 * @param route - The URL route template.
 * @param info - Contains the route's name, parameter schema, and search query schema.
 * @param putInfo - Contains the schemas for validating the request body and the response result.
 * @returns A function that performs a PUT request with validated inputs and returns a Promise resolving to the validated response.
 *
 * @throws Throws an error if the body validation fails, if the HTTP response is not ok, or if the response validation fails.
 */
export function makePutRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Body extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  putInfo: PutInfo<Body, Result>,
): PutRouteBuilder<Params, Search, Body, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: PutRouteBuilder<Params, Search, Body, Result> = (
    body: z.input<Body>,
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    const safeBody = putInfo.body.safeParse(body);
    if (!safeBody.success) {
      throw new Error(
        `Invalid body for route ${info.name}: ${safeBody.error.message}`,
      );
    }

    return fetch(urlBuilder(p, search), {
      ...options,
      method: "PUT",
      body: JSON.stringify(safeBody.data),
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = putInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(
            `Invalid response for route ${info.name}: ${result.error.message}`,
          );
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.body = undefined as z.output<Body>;
  routeBuilder.bodySchema = putInfo.body;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = putInfo.result;

  return routeBuilder;
}

/**
 * Constructs a GET route builder that performs a fetch request and validates its response.
 *
 * The returned function generates a URL based on the provided route and route information,
 * then makes a GET request with optional route parameters, search queries, and fetch options.
 * It checks for a successful HTTP response and validates the JSON payload against the specified
 * Zod schema. If the fetch response is unsuccessful or the validation fails, an error is thrown.
 *
 * @param route - The base path for the route, potentially containing dynamic segments.
 * @param info - An object containing route details including its name and the schemas for parameters and search queries.
 * @param getInfo - Contains the result schema used to validate the fetched JSON response.
 * @returns A GET route builder function that returns a promise resolving with the validated data.
 */
export function makeGetRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
  Result extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
  getInfo: GetInfo<Result>,
): GetRouteBuilder<Params, Search, Result> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: GetRouteBuilder<Params, Search, Result> = (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<z.output<Result>> => {
    return fetch(urlBuilder(p, search), options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
        }
        return res.json() as Promise<z.output<Result>>;
      })
      .then((data) => {
        const result = getInfo.result.safeParse(data);
        if (!result.success) {
          throw new Error(
            `Invalid response for route ${info.name}: ${result.error.message}`,
          );
        }
        return result.data;
      });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;
  routeBuilder.result = undefined as z.output<Result>;
  routeBuilder.resultSchema = getInfo.result;

  return routeBuilder;
}

/**
 * Creates a DELETE route builder that constructs a URL and performs a DELETE HTTP request.
 *
 * The returned function accepts optional URL parameters, search queries, and fetch options. It sends a DELETE request
 * to the URL assembled from the provided route pattern and validation info. If the fetch response indicates failure,
 * an error is thrown containing the route’s name and HTTP status text.
 *
 * @param route - The URL pattern for the route, which may include dynamic segments.
 * @param info - An object defining the route, including its name and zod schemas for validating parameters and search queries.
 *
 * @returns A function that makes a DELETE request to the generated URL.
 *
 * @throws Error - Thrown if the DELETE request does not return a successful response.
 */
export function makeDeleteRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
): DeleteRouteBuilder<Params, Search> {
  const urlBuilder = createRouteBuilder(route, info);

  const routeBuilder: DeleteRouteBuilder<Params, Search> = (
    p?: z.input<Params>,
    search?: z.input<Search>,
    options?: FetchOptions,
  ): Promise<void> => {
    return fetch(urlBuilder(p, search), {
      ...options,
      method: "DELETE",
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${info.name}: ${res.statusText}`);
      }
    });
  };

  routeBuilder.params = undefined as z.output<Params>;
  routeBuilder.paramsSchema = info.params;
  routeBuilder.search = undefined as z.output<Search>;
  routeBuilder.searchSchema = info.search;

  return routeBuilder;
}

/**
 * Creates a type-safe route builder with integrated React link components.
 *
 * This function initializes a route builder from a given URL pattern and route configuration. It augments the builder
 * with two React components, `ParamsLink` and `Link`, that generate links by validating and embedding route parameters and
 * search queries using the provided Zod schemas.
 *
 * @param route - The URL pattern for the route.
 * @param info - An object defining the route, including its name and validation schemas for parameters and search queries.
 *
 * @returns A route builder that provides methods for URL generation and React components for link creation.
 *
 * @remarks
 * Route parameters and search queries are validated against the provided schemas. If validation fails, errors thrown by the
 * Zod parsing functions will propagate.
 */
export function makeRoute<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema = typeof emptySchema,
>(
  route: string,
  info: RouteInfo<Params, Search>,
): RouteBuilder<Params, Search> {
  const urlBuilder: RouteBuilder<Params, Search> = createRouteBuilder(
    route,
    info,
  ) as RouteBuilder<Params, Search>;

  urlBuilder.routeName = info.name;

  urlBuilder.ParamsLink = function RouteLink({
    params: linkParams,
    search: linkSearch,
    children,
    ...props
  }: Omit<LinkProps, "href"> & {
    params?: z.input<Params>;
    search?: z.input<Search>;
  } & { children?: React.ReactNode }) {
    return (
      <Link {...props} href={urlBuilder(linkParams, linkSearch)}>
        {children}
      </Link>
    );
  };

  urlBuilder.Link = function RouteLink({
    search: linkSearch,
    children,
    ...props
  }: Omit<LinkProps, "href"> &
    z.input<Params> & {
      search?: z.input<Search>;
    } & { children?: React.ReactNode }) {
    const params = info.params.parse(props);
    const extraProps = { ...props };
    for (const key of Object.keys(params)) {
      delete extraProps[key];
    }
    return (
      <Link
        {...extraProps}
        href={urlBuilder(info.params.parse(props), linkSearch)}
      >
        {children}
      </Link>
    );
  };

  urlBuilder.params = undefined as z.output<Params>;
  urlBuilder.paramsSchema = info.params;
  urlBuilder.search = undefined as z.output<Search>;
  urlBuilder.searchSchema = info.search;

  return urlBuilder;
}
