/**
 * Extracts a human-readable message from a wide range of error-like values.
 *
 * Prefers a truthy `serverError` property if present, then an `Error` instance's `message`, then a `message` property on objects, then plain strings, and falls back to a generic message.
 *
 * @param error - Any value that may represent an error
 * @returns The resolved error message string; `"An error occurred"` if no message can be determined
 */
export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "serverError" in error &&
    error.serverError
  ) {
    return String(error.serverError);
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}