import { z } from "zod";

type ParsedData<T> = { error?: string; data?: T };

export function safeParseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams,
): z.infer<T> {
  const paramsArray = getAllParamsAsArrays(searchParams);
  return processSchema(schema, paramsArray) as z.infer<T>;
}

function processSchema(
  schema: z.ZodTypeAny,
  paramsArray: Record<string, string[]>,
): Record<string, unknown> {
  let workingSchema = schema;
  if (workingSchema instanceof z.ZodOptional) {
    workingSchema = workingSchema.unwrap() as z.ZodTypeAny;
  }
  switch (workingSchema.constructor) {
    case z.ZodObject: {
      const shape = (workingSchema as z.ZodObject<z.ZodRawShape>).shape;
      return parseShape(shape, paramsArray);
    }
    case z.ZodUnion: {
      const options = (
        workingSchema as z.ZodUnion<
          [z.ZodObject<z.ZodRawShape>, ...z.ZodObject<z.ZodRawShape>[]]
        >
      ).options;
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

function parseShape(
  shape: z.ZodRawShape,
  paramsArray: Record<string, string[]>,
  isPartOfUnion = false,
): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};

  for (const key in shape) {
    if (Object.prototype.hasOwnProperty.call(shape, key)) {
      const fieldSchema: z.ZodTypeAny | undefined = shape[key] as z.ZodTypeAny;
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

function convertToRequiredType(
  values: string[],
  schema: z.ZodTypeAny,
): ParsedData<unknown> {
  const usedSchema = getInnerType(schema);
  if (values.length > 1 && !(usedSchema instanceof z.ZodArray))
    return { error: "Multiple values for non-array field" };
  const value = parseValues(usedSchema, values);
  if (value.error && schema.constructor === z.ZodDefault) {
    return { data: undefined };
  }
  return value;
}

function parseValues(
  schema: z.ZodTypeAny,
  values: string[],
): ParsedData<unknown> {
  switch (schema.constructor) {
    case z.ZodNumber:
      return parseNumber(values[0]!);
    case z.ZodBoolean:
      return parseBoolean(values[0]!);
    case z.ZodString:
      return { data: values[0] };
    case z.ZodArray: {
      const elementSchema = (schema as z.ZodArray<z.ZodTypeAny>).element;
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

function getInnerType(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodDefault) {
    return schema.unwrap() as z.ZodTypeAny;
  }
  return schema;
}

function parseNumber(str: string): ParsedData<number> {
  const num = +str;
  return isNaN(num) ? { error: `${str} is NaN` } : { data: num };
}

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

function parseArray<T>(
  values: string[],
  parseFunction: (str: string) => ParsedData<T>,
): ParsedData<T[]> {
  const numbers = values.map(parseFunction);
  const error = numbers.find((n) => n.error)?.error;
  if (error) return { error };
  return { data: numbers.map((n) => n.data!) };
}
