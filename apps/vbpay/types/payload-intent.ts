/**
 * Represents the different types of intents that can be used with the Payload API.
 * These intent types indicate the purpose of a token or interaction with the API.
 */
export type PayloadIntentType =
  | "checkout_plugin"
  | "checkout_page"
  | "processing_account_plugin"
  | "payment_form"
  | "payment_method_form"
  | "oauth_client_token";
