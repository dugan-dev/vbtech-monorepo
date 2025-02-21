import { z } from "zod";

type ParsedData<T> = { error?: string; data?: T };

/**
 * Safely parses URL search parameters according to the provided Zod schema.
 *
 * This function converts the given URLSearchParams into a record of arrays and validates it
 * against the Zod schema. It returns the parsed data structured as specified by the schema.
 *
 * @param schema - The Zod schema to validate and transform the parameters.
 * @param searchParams - The URL search parameters to be parsed.
 *
 * @returns The data parsed and validated based on the schema.
 */
export function safeParseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams,
): z.infer<T> {
  const paramsArray = getAllParamsAsArrays(searchParams);
  return processSchema(schema, paramsArray);
}

/**
 * Processes a Zod schema against URL parameters.
 *
 * This function accepts a Zod schema—which may be optional, an object, or a union of objects—and a record of
 * URL parameter arrays. It extracts the inner type for optional schemas and, for object schemas, parses the defined
 * shape against the parameters. When provided with a union of object schemas, it iterates over each option and returns
 * the first result that contains all required fields; if none match, an empty object is returned.
 *
 * @param schema - The Zod schema to process.
 * @param paramsArray - A record mapping parameter names to arrays of string values.
 *
 * @returns An object with parsed values corresponding to the schema's fields.
 *
 * @throws Error If the schema type is not supported.
 */
function processSchema(
  schema: z.ZodTypeAny,
  paramsArray: Record<string, string[]>,
): Record<string, any> {
  if (schema instanceof z.ZodOptional) {
    schema = schema._def.innerType;
  }
  switch (schema.constructor) {
    case z.ZodObject: {
      const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
      return parseShape(shape, paramsArray);
    }
    case z.ZodUnion: {
      const options = (
        schema as z.ZodUnion<
          [z.ZodObject<z.ZodRawShape>, ...z.ZodObject<z.ZodRawShape>[]]
        >
      )._def.options;
      for (const option of options) {
        const shape = option.shape;
        const requireds = getRequireds(shape);

        const result = parseShape(shape, paramsArray, true);
        const keys = Object.keys(result);

        if (requireds.every((key) => keys.includes(key))) {
          return result;
        }
      }
      return {};
    }
    default:
      throw new Error("Unsupported schema type");
  }
}

/**
 * Extracts the keys of required fields from a Zod raw shape.
 *
 * Iterates over each field in the shape and returns an array of keys for which the field is neither marked as optional nor provided with a default value.
 *
 * @param shape - An object mapping field names to Zod schemas.
 * @returns An array of keys corresponding to required fields.
 */
function getRequireds(shape: z.ZodRawShape) {
  const keys: string[] = [];
  for (const key in shape) {
    const fieldShape = shape[key];
    if (
      !(fieldShape instanceof z.ZodDefault) &&
      !(fieldShape instanceof z.ZodOptional)
    )
      keys.push(key);
  }
  return keys;
}

/**
 * Parses a Zod schema shape against URL search parameters.
 *
 * Iterates over each field defined in the schema shape and attempts to convert the corresponding
 * URL search parameter values using the field's schema. Successfully converted values are then validated
 * using the schema’s safeParse method. If a conversion error occurs and the shape is part of a union type,
 * the function returns an empty object immediately; otherwise, the field is skipped. Fields with default
 * values (ZodDefault) are processed even when no parameter is provided.
 *
 * @param shape - The schema shape defining the expected fields.
 * @param paramsArray - A record mapping parameter names to arrays of string values.
 * @param isPartOfUnion - Indicates if the shape is part of a union type; if true, any conversion error results in an empty object.
 *
 * @returns An object containing the parsed and validated values for each successfully processed field.
 */
function parseShape(
  shape: z.ZodRawShape,
  paramsArray: Record<string, string[]>,
  isPartOfUnion = false,
): Record<string, any> {
  const parsed: Record<string, any> = {};

  for (const key in shape) {
    if (shape.hasOwnProperty(key)) {
      const fieldSchema: z.ZodTypeAny | undefined = shape[key];
      if (paramsArray[key]) {
        const fieldData = convertToRequiredType(paramsArray[key], fieldSchema!);

        if (fieldData.error) {
          if (isPartOfUnion) return {};
          continue;
        }
        const result = fieldSchema?.safeParse(fieldData.data!);
        if (result?.success) parsed[key] = result?.data;
      } else if (fieldSchema instanceof z.ZodDefault) {
        const result = fieldSchema.safeParse(undefined);
        if (result.success) parsed[key] = result.data;
      }
    }
  }

  return parsed;
}

/**
 * Converts URL search parameters into a record mapping each key to an array of its values.
 *
 * This function iterates over all provided search parameters and groups values by their corresponding keys.
 *
 * @param searchParams - The URLSearchParams instance containing the parameters.
 * @returns A record where keys are parameter names and values are arrays of associated string values.
 */
function getAllParamsAsArrays(
  searchParams: URLSearchParams,
): Record<string, string[]> {
  const params: Record<string, string[]> = {};

  searchParams.forEach((value, key) => {
    if (!params[key]) {
      params[key] = [];
    }
    params[key].push(value);
  });

  return params;
}

/**
 * Converts an array of string values into the type specified by the provided Zod schema.
 *
 * The function first extracts the underlying type from the schema. It then checks that multiple values are
 * only provided when the expected type is an array. If multiple values are given for a non-array type, an error
 * is returned. Otherwise, the values are parsed according to the expected type. For schemas with a default value,
 * if parsing fails, the returned data is set to undefined.
 *
 * @param values - An array of string values to be converted.
 * @param schema - The Zod schema defining the expected type (which may be wrapped by optional or default modifiers).
 * @returns An object containing either the parsed data or an error message.
 */
function convertToRequiredType(
  values: string[],
  schema: z.ZodTypeAny,
): ParsedData<any> {
  const usedSchema = getInnerType(schema);
  if (values.length > 1 && !(usedSchema instanceof z.ZodArray))
    return { error: "Multiple values for non-array field" };
  const value = parseValues(usedSchema, values);
  if (value.error && schema.constructor === z.ZodDefault) {
    return { data: undefined };
  }
  return value;
}

/**
 * Parses an array of string values according to a provided Zod schema.
 *
 * This function determines the type of the schema by checking its constructor and applies the appropriate
 * conversion: it parses the first string to a number for numeric schemas, to a boolean for boolean schemas,
 * or returns the first string for string schemas. For array schemas, it parses each value based on the element type.
 * If an unsupported type is encountered, an error message is returned.
 *
 * @param schema - The Zod schema defining the expected type.
 * @param values - The array of string values to be parsed.
 * @returns An object containing either the parsed data or an error message.
 */
function parseValues(schema: any, values: string[]): ParsedData<any> {
  switch (schema.constructor) {
    case z.ZodNumber:
      return parseNumber(values[0]!);
    case z.ZodBoolean:
      return parseBoolean(values[0]!);
    case z.ZodString:
      return { data: values[0] };
    case z.ZodArray: {
      const elementSchema = schema._def.type;
      switch (elementSchema.constructor) {
        case z.ZodNumber:
          return parseArray(values, parseNumber);
        case z.ZodBoolean:
          return parseArray(values, parseBoolean);
        case z.ZodString:
          return { data: values };
        default:
          return {
            error:
              "unsupported array element type " +
              String(elementSchema.constructor),
          };
      }
    }
    default:
      return { error: "unsupported type " + String(schema.constructor) };
  }
}

/**
 * Extracts the underlying schema from a ZodOptional or ZodDefault wrapper.
 *
 * If the provided schema is wrapped in an optional or default type, this function returns its inner type;
 * otherwise, it returns the original schema.
 *
 * @param schema - A Zod schema that might be wrapped in an optional or default type.
 * @returns The inner schema if wrapped, or the input schema if not.
 */
function getInnerType(schema: z.ZodTypeAny) {
  switch (schema.constructor) {
    case z.ZodOptional:
    case z.ZodDefault:
      return schema._def.innerType;
    default:
      return schema;
  }
}

/**
 * Converts a string to a number.
 *
 * This function attempts to convert the provided string into a numeric value using the unary plus operator. If the resulting number is NaN, it returns an object containing an error message; otherwise, it returns the number.
 *
 * @param str - The string to convert.
 * @returns An object with either the parsed number under "data" or an error message under "error".
 */
function parseNumber(str: string): ParsedData<number> {
  const num = +str;
  return isNaN(num) ? { error: `${str} is NaN` } : { data: num };
}

/**
 * Parses a string into a boolean value.
 *
 * Evaluates the input string and returns a parsed boolean result if the string is "true" or "false". For any other input, it returns an error message indicating that the string is not a valid boolean.
 *
 * @param str - The string value to parse.
 * @returns An object containing either the parsed boolean value or an error message.
 */
function parseBoolean(str: string): ParsedData<boolean> {
  switch (str) {
    case "true":
      return { data: true };
    case "false":
      return { data: false };
    default:
      return { error: `${str} is not a boolean` };
  }
}

/**
 * Parses an array of strings using the provided parsing function.
 *
 * Applies the parsing function to each string in the given array. If any parsing attempt results in an error,
 * the function returns that error immediately. Otherwise, it returns a ParsedData containing an array of all
 * successfully parsed values.
 *
 * @param values - An array of strings to parse.
 * @param parseFunction - A function that converts a string into a ParsedData.
 * @returns A ParsedData containing an array of parsed values if all values are successfully parsed, or a ParsedData 
 *          with an error message if any parsing fails.
 */
function parseArray<T>(
  values: string[],
  parseFunction: (str: string) => ParsedData<T>,
): ParsedData<T[]> {
  const numbers = values.map(parseFunction);
  const error = numbers.find((n) => n.error)?.error;
  if (error) return { error };
  return { data: numbers.map((n) => n.data!) };
}
