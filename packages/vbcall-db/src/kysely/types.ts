import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type client = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientName: string;
  clientCode: string;
  timezone: string;
  description: string;
  isActive: Generated<number>;
};
export type client_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientName: string;
  clientCode: string;
  timezone: string;
  description: string;
  isActive: number;
};
export type health_plan = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientPubId: string;
  planName: string;
  planId: string;
  phoneNumber: string;
  faxNumber: string;
  isActive: Generated<number>;
};
export type health_plan_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  clientPubId: string;
  planName: string;
  planId: string;
  phoneNumber: string;
  faxNumber: string;
  isActive: number;
};
export type health_plan_pbp = {
  id: Generated<number>;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  hpPubId: string;
  pbpId: string;
  pbpName: string;
  isActive: Generated<number>;
};
export type health_plan_pbp_hist = {
  id: Generated<number>;
  histAddedAt: Timestamp;
  pubId: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
  hpPubId: string;
  pbpId: string;
  pbpName: string;
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
export type DB = {
  client: client;
  clientHist: client_hist;
  healthPlan: health_plan;
  healthPlanHist: health_plan_hist;
  healthPlanPbp: health_plan_pbp;
  healthPlanPbpHist: health_plan_pbp_hist;
  user: user;
  userHist: user_hist;
  userSyncTimestamp: user_sync_timestamp;
};
