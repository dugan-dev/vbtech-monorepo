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
export type DB = {
  networkEntity: network_entity;
  networkEntityHist: network_entity_hist;
  payer: payer;
  payerHist: payer_hist;
};
