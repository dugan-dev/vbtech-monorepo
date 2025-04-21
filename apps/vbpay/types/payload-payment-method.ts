export type PayloadPaymentMethod = {
  id: string;
  object: "payment_method";
  account_holder: string;
  account_id: string;
  attrs: { pubId: string } | null;
  bank_name: string;
  birth_date: string; // ISO date string: "YYYY-MM-DD"
  created_at: string; // ISO datetime string
  customer_id: string;
  default_credit_method: boolean;
  default_deposit_method: boolean;
  default_payment_method: boolean;
  default_reversal_method: boolean;
  description: string;
  email: string | null;
  keep_active: boolean;
  modified_at: string; // ISO datetime string
  phone_number: string | null;
  ssn_last4: string | null;
  status: "active" | "inactive" | "declining";
  transfer_type: "send-only" | "receive-only" | "two-way";
  type: "card" | "bank_account";
  verification_status: "not-verified" | "verified" | "owner-verified";

  bank_account?: {
    account_class: "personal" | "business";
    account_currency: "USD" | "CAD";
    account_number: string;
    account_type: "checking" | "savings";
    routing_number: string;
  };

  billing_address?: {
    city: string | null;
    country_code: string;
    postal_code: string;
    state_province: string | null;
    street_address: string | null;
    unit_number: string | null;
  };

  card?: {
    card_brand:
      | "american_express"
      | "visa"
      | "mastercard"
      | "discover"
      | string;
    card_code: string;
    card_number: string;
    card_type: "credit" | "debit";
    expiry: string; // e.g., "12/26"
  };
};
