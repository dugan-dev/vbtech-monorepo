import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type network_entity = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  netEntType: string;
  payerPubId: string;
  marketingName: string;
  legalName: string | null;
  referenceName: string | null;
  orgNpi: string | null;
  taxId: string | null;
  isActive: Generated<number>;
};
export type network_entity_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  pubId: string;
  payerPubId: string;
  netEntType: string;
  marketingName: string;
  legalName: string | null;
  referenceName: string | null;
  taxId: string | null;
  orgNpi: string | null;
  isActive: number;
};
export type network_physician = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  payerPubId: string;
  taxId: string | null;
  npi: string | null;
  orgNpi: string | null;
  firstName: string;
  lastName: string;
  type: string;
  class: string;
  soleProprietor: Generated<number>;
  primaryTaxonomyCode: string | null;
  specialty: string | null;
  credential: string | null;
  isActive: Generated<number>;
  poNetEntPubId: string | null;
  pracNetEntPubId: string | null;
  faclNetEntPubId: string | null;
  vendorNetEntPubId: string | null;
};
export type network_physician_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  pubId: string;
  payerPubId: string;
  taxId: string | null;
  npi: string | null;
  orgNpi: string | null;
  firstName: string | null;
  lastName: string | null;
  type: string | null;
  class: string | null;
  soleProprietor: number;
  primaryTaxonomyCode: string | null;
  specialty: string | null;
  credential: string | null;
  isActive: number;
  poNetEntPubId: string | null;
  pracNetEntPubId: string | null;
  faclNetEntPubId: string | null;
  vendorNetEntPubId: string | null;
};
export type payer = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  payerType: string;
  initPerfYr: number;
  initPerfMo: number;
  cmsId: string | null;
  marketingName: string;
  legalName: string | null;
  referenceName: string | null;
  taxId: string | null;
  parentOrgName: string | null;
  websiteUrl: string | null;
  isActive: Generated<number>;
};
export type payer_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  payerType: string;
  initPerfYr: number | null;
  initPerfMo: number | null;
  cmsId: string | null;
  marketingName: string;
  legalName: string | null;
  referenceName: string | null;
  taxId: string | null;
  parentOrgName: string | null;
  websiteUrl: string | null;
  isActive: number;
};
export type user = {
  id: Generated<number>;
  userId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type user_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  userId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type user_sync_timestamp = {
  id: Generated<number>;
  appName: string;
  lastSyncAt: Timestamp;
};
export type vbpay_global_settings = {
  id: Generated<number>;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  allowedPayerTypes: string;
  payerReqTaxId: Generated<number>;
  poReqTaxId: Generated<number>;
  poReqNpi: Generated<number>;
  pracReqNpi: Generated<number>;
  pracReqTaxId: Generated<number>;
  physReqTaxId: Generated<number>;
  physReqCred: Generated<number>;
  physReqSpec: Generated<number>;
  physNppesRecon: Generated<number>;
  faclReqNpi: Generated<number>;
  faclReqTaxId: Generated<number>;
};
export type vbpay_global_settings_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  allowedPayerTypes: string;
  payerReqTaxId: number;
  poReqTaxId: number;
  poReqNpi: number;
  pracReqNpi: number;
  pracReqTaxId: number;
  physReqTaxId: number;
  physReqCred: number;
  physReqSpec: number;
  physNppesRecon: number;
  faclReqNpi: number;
  faclReqTaxId: number;
};
export type vbpay_license = {
  id: Generated<number>;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  type: string;
  fromDate: Timestamp;
  toDate: Timestamp;
  clientName: string;
  pocName: string;
  pocPhone: string;
  pocEmail: string;
  numPayers: number;
  paymentTypes: string;
  functionality: string;
};
export type vbpay_license_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  type: string;
  fromDate: Timestamp;
  toDate: Timestamp;
  clientName: string;
  pocName: string;
  pocPhone: string;
  pocEmail: string;
  numPayers: number;
  paymentTypes: string;
  functionality: string;
};
export type DB = {
  networkEntity: network_entity;
  networkEntityHist: network_entity_hist;
  networkPhysician: network_physician;
  networkPhysicianHist: network_physician_hist;
  payer: payer;
  payerHist: payer_hist;
  user: user;
  userHist: user_hist;
  userSyncTimestamp: user_sync_timestamp;
  vbpayGlobalSettings: vbpay_global_settings;
  vbpayGlobalSettingsHist: vbpay_global_settings_hist;
  vbpayLicense: vbpay_license;
  vbpayLicenseHist: vbpay_license_hist;
};
