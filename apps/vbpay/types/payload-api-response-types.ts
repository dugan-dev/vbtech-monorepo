export type PayloadProcessingAccount = {
  id: string;
  object: "processing_account";
  name: string;
  description: string | null;
  status: string;
  industry: string;
  attrs: any | null;
  created_at: string;
  modified_at: string;
  parent_org_id: string;
  legal_entity_id: string;
  processing_settings_id: string;
  billing_contact: PayloadBillingContact;
  payment_methods: PayloadPaymentMethod[];
  legal_entity: PayloadLegalEntity;
  processing_settings: PayloadProcessingSettings;
};

export type PayloadBillingContact = {
  name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state_province: string;
  postal_code: string;
  street_address1: string;
  street_address2: string | null;
};

export type PayloadPaymentMethod = {
  id: string;
  object: "payment_method";
  type: "bank_account" | "card";
  status: "active" | "inactive";
  bank_account?: PayloadBankAccount;
  card?: PayloadCard;
  billing_address?: PayloadBillingContact;
  created_at: string;
  modified_at: string;
};

export type PayloadBankAccount = {
  bank_name: string;
  account_type: "checking" | "savings";
  last4: string;
  routing_number: string;
};

export type PayloadCard = {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
};

export type PayloadLegalEntity = {
  id: string;
  object: "legal_entity";
  legal_name: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
  phone_number: string;
  ein: string;
  country: string;
  country_code: string;
  city: string;
  state_province: string;
  postal_code: string;
  street_address: string;
  unit_number: string | null;
  website: string;
  business_id: string | null;
  state_incorporated: string;
  type: string;
  owners: PayloadLegalEntityOwner[];
  public_exchanges: Record<string, any>;
  start_date: string;
  attrs: any | null;
  created_at: string;
  modified_at: string;
};

export type PayloadLegalEntityOwner = {
  name: string;
  title: string;
  email: string;
  phone: string;
  ownership_percent: number;
};

export type PayloadProcessingSettings = {
  id: string;
  object: "processing_setting";
  account_id: string;
  created_at: string;
  modified_at: string;
  attrs: any | null;
  integration_type: string;
  is_template: boolean | null;
  billing_setup: string;
  billing_flow: string;
  billing_preference: string;
  description: string | null;
  processing_type: string;
  pricing: string;
  currency: string;
  card_present: boolean;
  ecommerce: boolean;
  googlepay_enabled: boolean;
  googlepay_merchant_id: string | null;
  applepay_enabled: boolean;
  card_processing_enabled: boolean;
  bank_account_processing_enabled: boolean;
  guarantor_required: boolean;
  bank_account_conv_fee_alloc: number;
  bank_account_trans_cost: number;
  bank_account_trans_rate: number;
  card_processing: Record<string, any>;
  bank_account: Record<string, any>;
  duplicate_trans_limit: string;
  minimum_bill: number;
  monthly_processing_fee: number | null;
  nabu_fee: number;
  pci_fee: number;
  change_fee: number;
  chargeback_fee: number;
  retrieval_fee: number;
  amex_trans_cost: number | null;
  amex_trans_rate: number | null;
  credit_trans_cost: number | null;
  credit_trans_rate: number | null;
  credit_conv_fee_alloc: number | null;
  debit_trans_cost: number | null;
  debit_trans_rate: number | null;
  debit_conv_fee_alloc: number | null;
  prepaid_trans_cost: number | null;
  prepaid_trans_rate: number | null;
  prepaid_conv_fee_alloc: number | null;
  batch_fee: number;
  funding: Record<string, any>;
};
