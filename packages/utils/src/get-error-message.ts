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
